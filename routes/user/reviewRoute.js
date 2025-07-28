const { createReview, getProductReview, editReview, deleteReview, addProductReview, getMyReviews } = require("../../controller/user/review/reviewController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const catchError = require("../../services/catchError");


const router = require("express").Router()

router.route("/reviews").get(isAuthenticated, permitTo("customer"), catchError(getMyReviews))

router.route("/reviews/:id")
.post(isAuthenticated, permitTo("customer"), catchError(createReview))
// .post(isAuthenticated, addProductReview)
// .get(isAuthenticated, catchError(getProductReview))
.patch(isAuthenticated, permitTo("customer"), catchError(editReview))
.delete(isAuthenticated, permitTo("customer"), catchError(deleteReview));

module.exports = router;