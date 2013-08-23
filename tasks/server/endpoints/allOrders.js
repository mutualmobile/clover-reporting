var Q = require('q'),
    shared = require('../shared');

function allOrders(req, res) {
  var deferred = Q.defer();

  // Only need to make 1 service query
  // per incoming request, so cache the result
  // on the req obj and return the cached result
  // if present
  if (req.allOrders) {
    deferred.resolve(req.allOrders);
    return deferred.promise;
  } else {
    req.allOrders = deferred.promise;
  }

  shared.makeRequest('orders', req).then(function(data) {
    var orders = data && data.orders ? data.orders : [],
        collection = shared.db.collection('orders'),
        fetchPromises = [];

    orders.forEach(function(order) {
      if (order.isDeleted) { return; }

      var deferred = Q.defer();
      collection.findOne({id: order.id}, function(err, item) {
        if (err) {
          deferred.reject(err);
        } else {
          if (item && item.modified === order.modified) {
            deferred.resolve(item);
          } else {
            shared.makeRequest('orders/' + order.id, req).then(function(data) {
              var fullOrder = data && data.order ? data.order : null;
              if (fullOrder) {
                fullOrder = shared.extend({}, order, fullOrder);
                deferred.resolve(fullOrder);
                collection.update({id: fullOrder.id}, fullOrder, {upsert: true});
              } else {
                deferred.reject(data);
              }
            });
          }
        }
      });
      fetchPromises.push(deferred.promise);
    });

    Q.all(fetchPromises).then(function() {
      if (res) {
        res.send.apply(res, arguments);
      }
      deferred.resolve.apply(deferred, arguments);
    });
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject('Orders API request failed');
  });

  return deferred.promise;
}

module.exports = allOrders;