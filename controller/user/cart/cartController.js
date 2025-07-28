const Product = require("../../../model/productModel")
const User = require("../../../model/userModel")

// Add product to cart
exports.addToCart = async(req,res)=>{
      const userId = req.user.id
      if(!userId){
        return res.status(400).json({
            message: "User ID is required"
        })
      }
      const{productId} = req.params
      if(!productId){
        return res.status(400).json({
            message: "Product ID is required"
        })
      }
      const productExist = await Product.findById(productId)
      if(!productExist){
        return res.status(404).json({
            message: "Product not found"
        })
      }
      const user = await User.findById(userId)
      if(!user){
        return res.status(404).json({
            message: "User not found"
        })
      }

      // Check if the product is already in the user's cart
      if(user.cart.includes(productId)){
          return res.status(400).json({
              message: "Product is already in the cart"
          })
      }

      const cart = user.cart.push(productId)
      await user.save()
      return res.status(200).json({
          message: "Product added to cart successfully",
          data: {
              productId: productId,
              cart: user.cart
          }
      })
}

// Get cart items
exports.getCartItems = async(req,res)=>{
      const userId = req.user.id
      if(!userId){
        return res.status(400).json({
            message: "User ID is required"
        })
      }
      const userData = await User.findById(userId).populate({
            path: 'cart',
            select : "-__v -productStatus",
      })
      if(!userData){
        return res.status(404).json({
            message: "User not found"
        })
      }

      return res.status(200).json({
          message: "Cart Item fetched successfully",
          data: userData.cart
      })
}

// Delete cart item
exports.deleteCartItem = async(req,res)=>{
      // *To delete more than two products
      // const {productIds} = req.body

      const userId = req.user.id
      if(!userId){
        return res.status(400).json({
            message: "User ID is required"
        })
      }
      const{productId} = req.params
      if(!productId){
        return res.status(400).json({
            message: "Product ID is required"
        })
      }
      const productExist = await Product.findById(productId)
      if(!productExist){
        return res.status(404).json({
            message: "Product not found"
        })
      }
      // get user cart
      const user = await User.findById(userId)
      if(!user){
        return res.status(404).json({
            message: "User not found"
        })
      }

      // Check if the product is in the user's cart
      if(!user.cart.includes(productId)){
          return res.status(400).json({
              message: "Product is not in the cart"
          })
      }

      user.cart = user.cart.filter(pId => !productId.includes(pId)) // [1,2,3] ==> 2 ==> filter ==> [1,3] ==> user.cart = [1,3]

      // *To delete more than two products
      // productIds.forEach(productIdd => {
      //   user.cart = user.cart.filter(pId => pId != productIdd) // [1,2,3] ==> 2 ==> filter ==> [1,3] ==> user.cart = [1,3]
      // })

      await user.save()
      return res.status(200).json({
          message: "Product removed from cart successfully",
          data: null
      })
}