const Review = require("../../../model/reviewModel");
const Product = require("../../../model/productModel");

exports.createReview = async (req, res) => {
      const userId = req.user.id
      // check if userId exist or not
      if (!userId) {
            return res.status(400).json({
                  message: "User ID is required"
            });
      }

      const productId = req.params.id
      // check if that productId exist or not
      const productExists = await Product.findById(productId);
      if (!productExists) {
            return res.status(404).json({
                  message: "Product with this ID does not exist"
            });
      }

      const {rating, message } = req.body
      if(!rating || !message || !productId){
            return res.status(400).json({
                  message: "Please provide rating, message and product ID"
            });
      }

      // check if userId already reviewed this product
      const existingReview = await Review.findOne({ userId, productId });
      if (existingReview) {
            return res.status(400).json({
                  message: "You have already reviewed this product"
            });
      }

      // validate rating
      if (rating < 1 || rating > 10) {
            return res.status(400).json({
                  message: "Rating must be between 1 and 10"
            });
      }

      // validate message
      if (typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({
                  message: "Message is required and must be a string"
            });
      }

      // insert them into Review model
      const review = await Review.create({
            userId,
            productId,
            rating,
            message
      });
      return res.status(201).json({
            message: "Review created successfully",
            data: review
      });
}

// exports.getProductReview = async(req, res)=> {
//       const productId = req.params.id
//       if(!productId){
//             return res.status(400).json({
//                   message: "Please provide product ID"
//             })
//       }
//       // check if that productId product exist or not    
//       const productExist = await Product.findById(productId)
//       if(!productExist){
//             return res.status(404).json({
//                   message: "Product with that id doesnot exist"
//             })
//       }
//       const reviews = await Review.find({ productId }).populate("userId");
//       //
//       if(!reviews){
//             return res.status(404).json({
//                   message: "No reviews found for this product"
//             });
//       }
//       //
//       return res.status(200).json({
//             message: "Reviews fetched successfully",
//             data: reviews
//       });
// }

// Get My Reviews API

exports.getMyReviews = async (req, res) => {
      const userId = req.user.id;
      // check if userId exist or not
      if (!userId) {
            return res.status(400).json({
                  message: "User ID is required"
            });
      }
      const reviews = await Review.find({ userId })
      if (!reviews || reviews.length === 0) {
            return res.status(404).json({
                  message: "No reviews found for this user"
            });
      }
      return res.status(200).json({
            message: "Reviews fetched successfully",
            data: reviews
      });
}

// edit review API
exports.editReview = async(req, res)=>{
      const userId = req.user.id
      // check if userId exist or not
      if (!userId) {
            return res.status(400).json({
                  message: "User ID is required"
            });
      }
      const reviewId = req.params.id
      if(!reviewId){
            return res.status(400).json({
                  message: "Please provide review Id"
            })
      }
      const review = await Review.findById(reviewId)
      //
      if(!review){
            return res.status(404).json({
                  message: "Review not found with this Id"
            })
      }
      
      const { rating, message } = req.body;
      
      // validate rating
      if (rating < 1 || rating > 10) {
            return res.status(400).json({
                  message: "Rating must be between 1 and 10"
            });
      }

      // validate message
      if (typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({
                  message: "Message is required and must be a string"
            });
      }

      // update the review
      review.rating = rating;
      review.message = message;
      
      await review.save();
      
      return res.status(200).json({
            message: "Review updated successfully",
            data: review
      });
}

// delete review API
exports.deleteReview = async(req, res)=>{
      const userId = req.user.id
      // check if userId exist or not
      if (!userId) {
            return res.status(400).json({
                  message: "User ID is required"
            });
      }
      const reviewId = req.params.id
      if(!reviewId){
            return res.status(400).json({
                  message: "Please provide review Id"
            })
      }
      const review = await Review.findByIdAndDelete(reviewId)
      //
      if(!review){
            return res.status(404).json({
                  message: "Review not found with this Id"
            })
      }

      return res.status(200).json({
            message: "Review deleted successfully"
      })
}

// exports.addProductReview = async(req,res)=>{
//       const userId = req.user.id
//       // check if userId exist or not
//       if (!userId) {
//             return res.status(400).json({
//                   message: "User ID is required"
//             });
//       }
//       const { rating, message } = req.body;

//       const productId = req.params.id
//       // const product = await Product.findById(productId);

//       // check if that productId exist or not
//       const product = await Product.findById(productId);
//       if (!product) {
//             return res.status(404).json({
//                   message: "Product with this ID does not exist"
//             });
//       }
//       if (!productId || !rating || !message) {
//             return res.status(400).json({
//                   message: "Please provide product ID, rating, and message"
//             });
//       }
//       const review = {
//             userId,
//             productId,
//             rating,
//             message,
//             createdAt: new Date()
//       }
//       // validate product.reviews
//       if(product.reviews){
//             product.reviews = [];
//       }

//       // check for existing review
//       const existingReview = product.reviews.find(r => r.userId.toString() === userId.toString());
//       if (existingReview) {
//             return res.status(400).json({
//                   message: "You have already reviewed this product"
//             });
//       }
//       product.reviews.push(review);
//       await product.save();
//       return res.status(201).json({
//             message: "Review done successfully",
//             data: review
//       });
// }
