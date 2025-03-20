//Kütüphaneler
const express = require('express')
const router = express.Router()

//Database Şemaları
const { productSchema } = require('../../models/product')

//Yardımcı Metodlar
const basicCrud = require('../../helpers/basicCrud')
const { inputControllerMiddleware, authCheckMiddleware } = require('../../middleware/inputController')
const { setProductInput, updateProductInput, deleteProductInput, getProductInput } = require('../../controllers/Admin/types')


//------------BASIC CRUD PROCEDURES------------------
router.route('/setProduct').post(authCheckMiddleware, inputControllerMiddleware(setProductInput, basicCrud.set, 'post', productSchema, { sku: "" }))

router.route('/updateProduct').patch(authCheckMiddleware, inputControllerMiddleware(updateProductInput, basicCrud.update, 'post', productSchema, { sku: "" }))

router.route('/deleteProduct').delete(authCheckMiddleware, inputControllerMiddleware(deleteProductInput, basicCrud.delete, 'post', productSchema))

router.route('/getProduct/:_id?').get(authCheckMiddleware, inputControllerMiddleware(getProductInput, basicCrud.get, 'get', productSchema))


module.exports = router
