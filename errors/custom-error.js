const { z } = require('zod')
const { errorMessages } = require('./error-messages')
const { adminErrorMessages } = require('../controllers/Admin/error')
const { customerErrorMessages } = require('../controllers/Customer/error')


const databaseActionType = z.enum([
  'create',
  'read',
  'update',
  'delete'
])

const errorRoute = z.enum([
  'general',
  'admin',
  'customer',
])

class CustomAPIError extends Error {
  constructor(message, statusCode, customErrorCode, detail) {
    super(message)
    this.statusCode = statusCode
    this.customErrorCode = customErrorCode
    this.detail = detail
  }
}

const createCustomError = (errorCode, route, language, detail) => {
  let errorMessage

  switch (route) {
    case errorRoute.enum.general:
      errorMessage = errorMessages(errorCode, detail);
      break;
    case errorRoute.enum.customer:
      errorMessage = customerErrorMessages(errorCode, detail);
      break;
    case errorRoute.enum.admin:
      errorMessage = adminErrorMessages(errorCode, detail);
      break;
  }

  const { message, statusCode, errorCode: customErrorCode, detail: messageDetail } = errorMessage

  return new CustomAPIError(message[language], statusCode, customErrorCode, messageDetail)

}


module.exports = { createCustomError, CustomAPIError, errorRoute, databaseActionType }
