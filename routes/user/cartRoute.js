const { addToCart, getCartItems, deleteCartItem, updateCartItems } = require('../../controller/user/cart/cartController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');
const catchError = require('../../services/catchError');


const router = require('express').Router();

router.route("/cart/:productId")
.post(isAuthenticated, permitTo('customer'), catchError(addToCart))
.delete(isAuthenticated, permitTo('customer'), catchError(deleteCartItem))
.patch(isAuthenticated, permitTo('customer'), catchError(updateCartItems))

router.route("/cart").get(isAuthenticated, permitTo('customer'), catchError(getCartItems))

module.exports = router;