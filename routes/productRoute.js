const { createProduct } = require('../controller/admin/product/productController');
const isAuthenticated = require('../middleware/isAuthenticated');
const permitTo = require('../middleware/permitTo');
const { multer, storage } = require('../middleware/multerConfig');
const upload = multer({storage: storage}) 

const router = require('express').Router();

router.route('/product').post(isAuthenticated, permitTo('admin'), upload.single('productImage'), createProduct)

module.exports = router;