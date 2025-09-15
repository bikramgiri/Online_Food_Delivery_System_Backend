const { createProduct, editProduct, deleteProduct, updateProductStatus, updateProductStockQty, getOrdersOfProduct } = require('../../controller/admin/product/productController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');
const { multer, storage, upload } = require('../../middleware/multerConfig');
const catchError = require('../../services/catchError');
const { getProducts, getProduct } = require('../../controller/global/globalController');
// const upload = multer({storage: storage}) 
// const { upload } = require('../middleware/multerConfig');

const router = require('express').Router();

router.route('/products')
.post(isAuthenticated, permitTo('admin'), (upload.single('file')), catchError(createProduct))
.get(catchError(getProducts));

router.route('/productOrders/:id')
.get(isAuthenticated, permitTo('admin'), catchError(getOrdersOfProduct));

router.route('/products/productstockqty/:id')
.patch(isAuthenticated, permitTo('admin'), updateProductStockQty)

router.route('/products/productstatus/:id')
.patch(isAuthenticated, permitTo('admin'), updateProductStatus)

router.route('/products/:id')
.get(catchError(getProduct))
.patch(isAuthenticated, permitTo('admin'), (upload.single('file')), catchError(editProduct))
.delete(isAuthenticated, permitTo('admin'), catchError(deleteProduct))

module.exports = router;