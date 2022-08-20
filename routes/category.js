const express = require('express')
const { addCategory, getAllCategory, deleteSubCategories, deleteCategory, updateSubCategory, updateCategory } = require('../controllers/categoryController')
const { isLoggedIn, customRole } = require('../middlewares/user')
const router = express.Router()


router.route('/admin/category/add').post(isLoggedIn,customRole("admin"),addCategory)
router.route('/admin/category/deletesubcategory').post(isLoggedIn,customRole("admin"),deleteSubCategories)
router.route('/admin/category/updatesubcategory/:catId').put(isLoggedIn,customRole("admin"),updateSubCategory)
router.route('/admin/category/delete/:id').delete(isLoggedIn,customRole("admin"),deleteCategory)
router.route('/admin/category/update/:id').put(isLoggedIn,customRole("admin"),updateCategory)

router.route('/category/all').get(getAllCategory);

module.exports = router