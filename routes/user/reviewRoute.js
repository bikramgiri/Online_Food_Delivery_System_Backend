const { createReview, getProductsReview, editReview, deleteReview, addProductReview, getMyReviews, getSingleReview } = require("../../controller/user/review/reviewController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const catchError = require("../../services/catchError");
const { multer, storage, upload } = require('../../middleware/multerConfig');
const { getAllReviews } = require("../../controller/global/globalController");

const router = require("express").Router()

router.route("/allreviews")
.get(isAuthenticated, permitTo("admin"), catchError(getAllReviews))

router.route("/reviews")
.get(isAuthenticated, permitTo("customer"), catchError(getMyReviews))

router.route("/review/:id")
.get(catchError(getSingleReview))

router.route("/reviews/:id")
.post(isAuthenticated, permitTo("customer"),  (upload.single('file')), catchError(createReview))
// .post(isAuthenticated, addProductReview)
.get(isAuthenticated, catchError(getProductsReview))
.patch(isAuthenticated, permitTo("customer"),  (upload.single('file')), catchError(editReview))
.delete(isAuthenticated, catchError(deleteReview));

module.exports = router;