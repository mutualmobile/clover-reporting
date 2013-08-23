var shared = require('./shared'),
    orderOverview = require('./endpoints/orderOverview'),
    allOrders = require('./endpoints/allOrders'),
    allCategories = require('./endpoints/allCategories'),
    revenueByItem = require('./endpoints/revenueByItem'),
    revenueByCategory = require('./endpoints/revenueByCategory'),
    employeeData = require('./endpoints/employeeData'),
    productData = require('./endpoints/productData');

// ----------- Routes ------------
// Note that all route functions return
// a promise, so they can be used either
// directly as a normal route by express
// or by other functions which may just
// need their data

exports.init = function(server) {
  shared.db.open(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('Connected to clover database');
    }
  });
  server.get('/orders', orderOverview);
  server.get('/all-orders', allOrders);
  server.get('/all-categories', allCategories);
  server.get('/revenue-by-item', revenueByItem);
  server.get('/revenue-by-category', revenueByCategory);
  server.get('/employee-data', employeeData);
  server.get('/product-data', productData);
};