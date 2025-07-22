const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");

// Get All Products
exports.getProducts = async (req, res) => {
      const products = await Product.find()
      // const products = await Product.find().populate({
      //       path : "reviews",
      //       populate: {
      //             path: "userId",
      //             select: "username email" // Select fields to populate from the user model
      //       }
      // })

      if (products.length === 0) {
            return res.status(404).json({
                  message: "No products found",
                  data: []
            });
      }
      return res.status(200).json({
            message: "Products fetched successfully",
            data: products
      });
}

// Get Single Product
exports.getProduct = async (req, res) => {
      const productId = req.params.id;
      if (!productId) {
            return res.status(400).json({
                  message: "Product ID is required"
            });
      }

      const productReviews = await Review.find({ productId }).populate("userId")
      if (!productReviews) {
            return res.status(404).json({
                  message: "No reviews found for this product",
                  data: []
            });
      }
      const product = await Product.findById(productId);
      if (!product) {
            return res.status(404).json({
                  message: "Product not found",
                  data: {
                      data: [],
                      data2: []
                 }
            });
      }
      return res.status(200).json({
            message: "Product fetched successfully",
            data: {product, productReviews}
      });
}