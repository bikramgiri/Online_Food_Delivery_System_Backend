const { registerUser, loginUser, logout, forgotPassword, verifyOtp, changePassword } = require('../controller/auth/authController');
const catchError = require('../services/catchError');

const router = require('express').Router();

// routes here
router.route('/register').post(catchError(registerUser));
router.route('/login').post(catchError(loginUser));
router.route("/logout").get(catchError(logout));
router.route("/forgotPassword").post(catchError(forgotPassword));
// router.route("/verifyOtp/:id").post(catchError(verifyOtp))
// or
router.route("/verifyOtp").post(catchError(verifyOtp))
// router.route("/changePassword/:id1/:id2").post(sanitizer,checkPasswordChange)
// or
// router.route("/changePassword/:email/:otp").post(catchError(changePassword))
// or
router.route("/changePassword").post(changePassword)


module.exports = router;