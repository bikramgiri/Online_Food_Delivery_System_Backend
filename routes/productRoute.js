const { createProduct, getProducts, getProduct } = require('../controller/admin/product/productController');
const isAuthenticated = require('../middleware/isAuthenticated');
const permitTo = require('../middleware/permitTo');
const { multer, storage } = require('../middleware/multerConfig');
const catchError = require('../services/catchError');
const upload = multer({storage: storage}) 

const router = require('express').Router();

router.route('/products').post(catchError(isAuthenticated), catchError(permitTo('admin')), catchError(upload.single('productImage')), catchError(createProduct)).get(catchError(isAuthenticated), catchError(getProducts));
router.route('/products/:id').get(catchError(getProduct));

module.exports = router;