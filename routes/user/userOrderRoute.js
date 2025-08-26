const { createOrder, getsMyOrders, updateMyOrder, deleteMyOrder,  cancelMyOrder } = require('../../controller/user/order/orderController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');
const catchError = require('../../services/catchError');

const router = require('express').Router();

router.route("/orders")
.post(isAuthenticated, catchError(createOrder))
.get(isAuthenticated, catchError(getsMyOrders))

router.route("/orders/:id")
.patch(isAuthenticated, permitTo('customer'), catchError(updateMyOrder))
.delete(isAuthenticated, permitTo('customer'), catchError(deleteMyOrder))

router.route("/orders/cancel/:id")
.patch(isAuthenticated, permitTo('customer'), catchError(cancelMyOrder))

module.exports = router;