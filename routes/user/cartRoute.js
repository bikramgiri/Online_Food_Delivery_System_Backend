const { addToCart, getCartItems, deleteCartItem } = require('../../controller/user/cart/cartController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const catchError = require('../../services/catchError');


const router = require('express').Router();

router.route("/cart/:productId")
.post(isAuthenticated, catchError(addToCart))
.delete(isAuthenticated, deleteCartItem)

router.route("/cart").get(isAuthenticated, catchError(getCartItems))

module.exports = router;