var Q = require('q'),
    shared = require('../shared');

function orderOverview(req, res) {
  var deferred = Q.defer();

  // Only need to make 1 service query
  // per incoming request, so cache the result
  // on the req obj and return the cached result
  // if present
  if (req.orderOverview) {
    deferred.resolve(req.orderOverview);
    return deferred.promise;
  } else {
    req.orderOverview = deferred.promise;
  }

  shared.makeRequest('orders', req).then(function() {
    if (res) {
      res.send.apply(res, arguments);
    }
    deferred.resolve.apply(deferred, arguments);
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject('Orders API request failed');
  });

  return deferred.promise;
}

module.exports = orderOverview;