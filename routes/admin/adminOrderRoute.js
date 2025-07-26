const { getsAllOrders } = require('../../controller/admin/order/orderController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const catchError = require('../../services/catchError');


const router = require('express').Router();

router.route("/orders").get(isAuthenticated, catchError(getsAllOrders))

module.exports = router;