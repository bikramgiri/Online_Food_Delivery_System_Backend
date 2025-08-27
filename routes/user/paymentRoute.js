const { initiateKhaltiPayment, verifyPidx } = require("../../controller/user/payment/paymentController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchError = require("../../services/catchError");


const router = require("express").Router();

router.route("/payment").post(isAuthenticated, catchError(initiateKhaltiPayment))
router.route("/verifypidx").post(isAuthenticated, catchError(verifyPidx))

module.exports = router;