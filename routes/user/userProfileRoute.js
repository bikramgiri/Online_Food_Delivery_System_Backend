const { getMyProfile, updateMyPassword, updateMyProfile, deleteMyProfile } = require('../../controller/user/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const catchError = require('../../services/catchError')


const router = require('express').Router()

router.route("/profile")
.get(isAuthenticated, catchError(getMyProfile))
.patch(isAuthenticated, catchError(updateMyProfile))
.delete(isAuthenticated, catchError(deleteMyProfile))

router.route("/changePassword").patch(isAuthenticated, catchError(updateMyPassword))

module.exports = router