//Kütüphaneler
const express = require('express')
const router = express.Router()

//Database Şemaları
const { personelSchema } = require('../../models/personel')

//Yardımcı Metodlar
const { inputControllerMiddleware, authCheckMiddleware } = require('../../middleware/inputController')
const { loginInput, getCustomerInput, paymentInput } = require('../../controllers/Customer/types')
const { login, payment } = require('../../controllers/Customer/customer')
const basicCrud = require('../../helpers/basicCrud')

//Routes
router.route('/login').post(inputControllerMiddleware(loginInput, login, 'post'))
router.route('/getCustomer/:_id?').get(authCheckMiddleware, inputControllerMiddleware(getCustomerInput, basicCrud.get, 'get', personelSchema))
router.route('/payment').post(authCheckMiddleware, inputControllerMiddleware(paymentInput, payment, 'post'))


module.exports = router
