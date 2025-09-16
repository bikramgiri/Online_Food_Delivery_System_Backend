const DataServices = require('../../controller/admin/misc/dataService');
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');

const router = require('express').Router();

router.route("/misc/datas").get(isAuthenticated, permitTo('admin'), DataServices.getDatas);

module.exports = router;