const Product = require("../../../model/productModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
      const file = req.file;
      // if (!file) {
      //       productImage = "No image uploaded"; // If no file is uploaded, set a default message
      // } else {
      //       productImage = process.env.BACKEND_URL + '/storage/' + file.filename; // Get the filename from the uploaded file
      // }

      // *OR

      productImage = process.env.BACKEND_URL + '/storage/' + file.filename; // Get the filename from the uploaded file

      const {productName, productStockQty, productPrice, productStatus, productDescription} = req.body;

      if (!productName || !productImage || !productStockQty || !productPrice || !productStatus || !productDescription) {
            return res.status(400).json({
                  message: "productName, productImage, productStockQty, productPrice, productStatus and productDescription are required"
            });
      }

      // validate product name
      const existingProduct = await Product.findOne({
            productName: productName
      });
      if (existingProduct) {
            return res.status(400).json({
                  message: "Product with this name already exists"
            });
      }

      // validate product image is already exists
      const existingImage = await Product.findOne({
            productImage: productImage
      });
      if (existingImage) {
            return res.status(400).json({
                  message: "Product with this image already exists"
            });
      }

      // validate product stock quantity
      if (productStockQty < 0) {
            return res.status(400).json({
                  message: "Product stock quantity must be a positive number"
            });
      }

      // validate product price
      if (productPrice < 0) {
            return res.status(400).json({
                  message: "Product price must be a positive number"
            });
      }

      // validate product status
      if (!['Available', 'Unavailable'].includes(productStatus)) {
            return res.status(400).json({
                  message: "Product status must be either 'Available' or 'Unavailable'"
            });
      }

      // validate product description
      if (productDescription.length < 4) {
            return res.status(400).json({
                  message: "Product description must be at least 10 characters long"
            });
      }

      // Create a new product
      const newProduct = await Product.create({
            productName : productName,
            productImage : productImage, // Assuming you want to store the full URL
            productStockQty : productStockQty,
            productPrice : productPrice,
            productStatus : productStatus,
            productDescription : productDescription
      });

      return res.status(201).json({
            message: "Product created successfully",
            data: newProduct
      });
};

// Edit Product API
exports.editProduct = async (req, res) => {
      const productId = req.params.id;
      if (!productId) {
            return res.status(400).json({
                  message: "Product ID is required"
            });
      }

      const product = await Product.findById(productId);
      if (!product) {
            return res.status(404).json({
                  message: "Product not found with this ID"
            });
      }
      const productImage = product.productImage; // http://localhost:3000/storage/AI.jpeg

      const {productName,  productStockQty, productPrice, productStatus, productDescription} = req.body;
      if (!productName || !productImage || !productStockQty || !productPrice || !productStatus || !productDescription) {
            return res.status(400).json({
                  message: "productName, productImage, productStockQty, productPrice, productStatus and productDescription are required"
            });
      }

      // validate product stock quantity
      if (productStockQty < 0) {
            return res.status(400).json({
                  message: "Product stock quantity must be a positive number"
            });
      }

      // validate product price
      if (productPrice < 0) {
            return res.status(400).json({
                  message: "Product price must be a positive number"
            });
      }

      // validate product status
      if (!['Available', 'Unavailable'].includes(productStatus)) {
            return res.status(400).json({
                  message: "Product status must be either 'Available' or 'Unavailable'"
            });
      }

      // validate product description
      if (productDescription.length < 4) {
            return res.status(400).json({
                  message: "Product description must be at least 10 characters long"
            });
      }
      
      const oldProductImage = product.productImage; // http://localhost:3000/storage/AI.jpeg
      const lengthToCut = "http://localhost:3000/storage/".length
      const finalImagePathAfterCut = oldProductImage.slice(lengthToCut);
      if(req.file && req.file.filename) {
            // Delete the old image file from Storage folder
            fs.unlink("./storage/" + finalImagePathAfterCut, (err) => {
                  if (err) {
                        console.error("Error deleting old image:", err);
                  } else {
                        console.log("Old image deleted successfully");
                  }
            });
      const productImage = process.env.BACKEND_URL + '/storage/' + req.file.filename; // Update with new image
      const updatedProduct = await Product.findByIdAndUpdate(productId, {
            productName: productName,
            productImage: productImage,
            productStockQty: productStockQty,
            productPrice: productPrice,
            productStatus: productStatus,
            productDescription: productDescription
      }, { new: true });
      return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
      });
}};

// delete product API
exports.deleteProduct = async (req, res) => {
      const productId = req.params.id;
      if (!productId) {
            return res.status(400).json({
                  message: "Product ID is required"
            });
      }
      const product = await Product.findById(productId);
      if (!product) {
            return res.status(404).json({
                  message: "Product not found with this ID"
            });
      }

      const oldProductImage = product.productImage // http://localhost:3000/storage/AI.jpeg
      const lengthToCut = "http://localhost:3000/storage/".length
      const finalImagePathAfterCut = oldProductImage.slice(lengthToCut);
      // Delete the image file from Storage folder
      fs.unlink("./storage/" + finalImagePathAfterCut, (err) => {
            if (err) {
                  console.error("Error deleting image:", err);
            }else {
                  console.log("Image deleted successfully");
            }
      });
      await Product.findByIdAndDelete(productId);
      return res.status(200).json({
            message: "Product deleted successfully"
      });
}
