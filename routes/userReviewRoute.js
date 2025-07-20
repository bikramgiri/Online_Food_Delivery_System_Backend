const { createReview, getProductReview, deleteReview, addProductReview } = require("../controller/user/userController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchError = require("../services/catchError");


const router = require("express").Router()

// router.route("/reviews")
router.route("/reviews/:id")
// .post(isAuthenticated, catchError(createReview))
.post(isAuthenticated, addProductReview)
.get(isAuthenticated, catchError(getProductReview))
.delete(isAuthenticated, catchError(deleteReview));

module.exports = router;