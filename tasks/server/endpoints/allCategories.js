var Q = require('q'),
    shared = require('../shared');

function allCategories(req, res) {
  var deferred = Q.defer();

  // Only need to make 1 service query
  // per incoming request, so cache the result
  // on the req obj and return the cached result
  // if present
  if (req.allCategories) {
    deferred.resolve(req.allCategories);
    return deferred.promise;
  } else {
    req.allCategories = deferred.promise;
  }

  shared.makeRequest('/v2/merchant/RZC2F4FMKFJ12/inventory/categories', req.query).then(function(data) {
    var categories = data && data.categories ? data.categories : [],
        collection = shared.db.collection('categories'),
        fetchPromises = [],
        cacheThreshold = Date.now() - (1000 * 60 * 10); // 10 minutes

    categories.forEach(function(category) {
      var deferred = Q.defer();
      collection.findOne({id: category.id}, function(err, item) {
        if (err) {
          deferred.reject(err);
        } else {
          if (item && item.custom_last_updated > cacheThreshold) {
            deferred.resolve(item);
          } else {
            shared.makeRequest('/v2/merchant/RZC2F4FMKFJ12/inventory/categories/' + category.id).then(function(data) {
              var fullCategory = data && data.category ? data.category : null;
              if (fullCategory) {
                fullCategory.custom_last_updated = Date.now();
                deferred.resolve(fullCategory);
                collection.update({id: fullCategory.id}, fullCategory, {upsert: true});
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
    deferred.reject('Categories API request failed');
  });

  return deferred.promise;
}

module.exports = allCategories;