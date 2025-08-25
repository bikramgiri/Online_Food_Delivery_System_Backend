const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");

// Add product to cart
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({
      message: "Product ID is required",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check if the product is already in the user's cart if exist then increase quantity
  const existCartItem = user.cart.find((item) =>
    item.product.equals(productId)
  );
  if (existCartItem) {
    existCartItem.quantity += 1;
  } else {
    user.cart.push({
      product: productId,
      quantity: 1,
    });
  }

  await user.save();
  const updatedUser = await User.findById(userId).populate("cart.product");
  return res.status(200).json({
    message: "Product added to cart successfully",
    data: {
      productId: productId,
      cart: updatedUser.cart,
    },
  });
};

// Get cart items
exports.getCartItems = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }
  const userData = await User.findById(userId).populate({
    path: "cart.product",
    select: "-__v -productStatus",
  });
  if (!userData) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    message: "Cart Item fetched successfully",
    data: userData.cart,
  });
};

// Delete cart item
exports.deleteCartItem = async (req, res) => {
  // *To delete more than two products
  // const {productIds} = req.body

  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({
      message: "Product ID is required",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  // get user cart
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check if the product is in the user's cart
  if (!user.cart.includes(productId)) {
    return res.status(400).json({
      message: "Product is not in the cart",
    });
  }

  user.cart = user.cart.filter((pId) => !productId.includes(pId)); // [1,2,3] ==> 2 ==> filter ==> [1,3] ==> user.cart = [1,3]

  // *To delete more than two products
  // productIds.forEach(productIdd => {
  //   user.cart = user.cart.filter(pId => pId != productIdd) // [1,2,3] ==> 2 ==> filter ==> [1,3] ==> user.cart = [1,3]
  // })

  await user.save();
  return res.status(200).json({
    message: "Product removed from cart successfully",
    data: null,
  });
};

// update cart Items
exports.updateCartItems = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({
      message: "Product ID is required",
    });
  }
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({
      message: "Invalid quantity",
    });
  }
  // Check if the product exists

  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  // get user cart
  const user = await User.findById(userId);

  // Check if the product is in the user's cart
  const cartItem = user.cart.find((item) => item.product.equals(productId));
  if (!cartItem) {
    return res.status(404).json({
      message: "Product is not in the cart",
    });
  }

  // Update the quantity
  if (quantity <= 0) {
    return res.status(400).json({
      message: "Invalid quantity",
    });
  }

  cartItem.quantity = quantity;
  await user.save();
  
  return res.status(200).json({
    message: "Cart item updated successfully",
    data: user.cart,
  });
};
