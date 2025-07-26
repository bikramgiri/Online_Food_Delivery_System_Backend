const { createOrder, getsMyOrders } = require('../../controller/user/order/orderController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const catchError = require('../../services/catchError');


const router = require('express').Router();

router.route("/orders")
.post(isAuthenticated, createOrder)
.get(isAuthenticated, catchError(getsMyOrders))

module.exports = router;