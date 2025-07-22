const { getUsers, deleteUser } = require('../../controller/admin/user/userController')
const isAuthenticated = require('../../middleware/isAuthenticated');
const permitTo = require('../../middleware/permitTo');
const catchError = require('../../services/catchError');


const router = require('express').Router();

router.route("/users").get(isAuthenticated, permitTo('admin'), catchError(getUsers));
router.route("/users/:id").delete(isAuthenticated, permitTo('admin'), catchError(deleteUser));


module.exports = router;