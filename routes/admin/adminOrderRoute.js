const { getsAllOrders, getSingleOrder, updateOrderStatus, deleteOrder } = require('../../controller/admin/order/orderController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');
const catchError = require('../../services/catchError');

const router = require('express').Router();

router.route("/orders")
.get(isAuthenticated, catchError(getsAllOrders))

router.route("/orders/:id")
.get(isAuthenticated, catchError(getSingleOrder))
.patch(isAuthenticated, permitTo('admin'), catchError(updateOrderStatus))
.delete(isAuthenticated, permitTo('admin'), catchError(deleteOrder));

module.exports = router;