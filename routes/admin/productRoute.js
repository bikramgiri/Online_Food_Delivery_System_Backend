const { createProduct, editProduct, deleteProduct } = require('../../controller/admin/product/productController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');
const { multer, storage } = require('../../middleware/multerConfig');
const catchError = require('../../services/catchError');
const { getProducts, getProduct } = require('../../controller/global/globalController');
const upload = multer({storage: storage}) 

const router = require('express').Router();

router.route('/products')
.post(isAuthenticated, permitTo('admin'), (upload.single('productImage')), catchError(createProduct))
.get(catchError(getProducts));

router.route('/products/:id')
.get(catchError(getProduct))
.delete(isAuthenticated, permitTo('admin'), catchError(deleteProduct))
.patch(isAuthenticated, permitTo('admin'), (upload.single('productImage')), catchError(editProduct));

module.exports = router;