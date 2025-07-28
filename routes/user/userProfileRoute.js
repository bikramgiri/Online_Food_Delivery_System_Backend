const { getMyProfile, updateMyPassword, updateMyProfile, deleteMyProfile } = require('../../controller/user/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const permitTo = require('../../middleware/permitTo')
const catchError = require('../../services/catchError')


const router = require('express').Router()

router.route("/profile")
.get(isAuthenticated, catchError(getMyProfile))
.patch(isAuthenticated, permitTo('customer'), catchError(updateMyProfile))
.delete(isAuthenticated, permitTo('customer'), catchError(deleteMyProfile))

router.route("/changePassword").patch(isAuthenticated, permitTo('customer'), catchError(updateMyPassword))

module.exports = router