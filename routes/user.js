const express = require('express')
const { signup, login, logout, getUser } = require('../controllers/userController')
const { isLoggedIn } = require('../middlewares/user')
const router = express.Router()


router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(isLoggedIn,logout)
router.route('/user').get(isLoggedIn,getUser)
// router.route('/forgotPassword').post(forgotPassword)
// router.route('/password/reset/:token').post(passwordReset)
// router.route('/userdashboard').get(isLoggedIn,getLoggedInUserDetails)
// router.route('/password/update').post(isLoggedIn,changePassword)
// router.route('/userdashboard/update').post(isLoggedIn,updateUserDetails)


// admin only routes
// router.route('/admin/users').get(isLoggedIn,customRole('admin'),adminAllUsers)
// router.route('/admin/user/:id').get(isLoggedIn,customRole('admin'),admingetOneUser)
// .put(isLoggedIn,customRole("admin"),adminUpdateOneUserDetails)
// .delete(isLoggedIn,customRole("admin"),adminDeleteOneUser)

// manager only route
// router.route('/manager/users').get(isLoggedIn,customRole('manager'),managerAllUsers)


module.exports = router