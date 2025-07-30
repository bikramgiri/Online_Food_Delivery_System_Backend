const { initiateKhaltiPayment, verifyPidx } = require("../../controller/user/payment/paymentController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchError = require("../../services/catchError");


const router = require("express").Router();

router.route("/payment").post(initiateKhaltiPayment)
router.route("/payment/success").get(verifyPidx)

module.exports = router;