const adminRoutes = require('./admin/admin')
const customerRoutes = require('./customer/customer')

exports.initRoutes = function (app) {
  app.use('/api/v1/case/admin', adminRoutes)
  app.use('/api/v1/case/customer', customerRoutes)
}
