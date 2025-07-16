const Product = require("../../../model/productModel");


exports.createProduct = async (req, res) => {
      console.log(req.user)
      const {productName, productStockQty, productPrice, productStatus, productDescription} = req.body;

      if (!productName || !productStockQty || !productPrice || !productStatus || !productDescription) {
            return res.status(400).json({
                  message: "productName, productStockQty, productPrice, productStatus and productDescription are required"
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

      // Create a new product
      const newProduct = await Product.create({
            productName : productName,
            productStockQty : productStockQty,
            productPrice : productPrice,
            productStatus : productStatus,
            productDescription : productDescription
      });

      return res.status(201).json({
            message: "Product created successfully"
            });
};
