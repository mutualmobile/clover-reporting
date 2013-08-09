var https = require('https'),
    url = require('url'),
    Q = require('q'),
    mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    RateLimiter = require('limiter').RateLimiter;

var accessToken = '8b8a19c5-1b13-dcbd-c9b3-36e3b24eccea',
    server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('clover', server, {w: 'acknowledged'}),
    limiter = new RateLimiter(15, 'second');

// ------ Utility functions ------
function makeRequest(path, query) {
  var options = {
        hostname: 'api.clover.com',
        port: 443,
        path: path,
        method: 'GET'
      },
      deferred = Q.defer();

  query = query || {};
  query.access_token = accessToken;
  options.path = options.path + url.format({query: query});

  limiter.removeTokens(1, function() {
    https.get(options, function(apiRes) {
      var output = '';
      apiRes.setEncoding('utf8');
      apiRes.on('data', function (chunk) {
        output += chunk;
      });
      apiRes.on('error', function(e) {
        deferred.reject(e);
      });
      apiRes.on('end', function() {
        var data = null;
        if (apiRes.statusCode === 429) { // rate limited
          deferred.resolve(makeRequest(path, query));
        } else {
          try {
            data = JSON.parse(output);
          } catch(e) {
            console.log('error parsing JSON: ' + output);
          }
          deferred.resolve(data);
        }
      });
    });
  });

  return deferred.promise;
}

function batchOrder(query) {
  var deferred = Q.defer();

  makeRequest('/v2/merchant/RZC2F4FMKFJ12/orders', query).then(function(data) {
    var orders = data && data.orders ? data.orders : [],
        collection = db.collection('orders'),
        fetchPromises = [];

    orders.forEach(function(order) {
      if (order.isDeleted) { return; }

      var deferred = Q.defer();
      collection.findOne({id: order.id}, function(err, item) {
        if (err) {
          deferred.reject(err);
        } else {
          if (item && item.custom_modified === order.modified) {
            deferred.resolve(item);
          } else {
            makeRequest('/v2/merchant/RZC2F4FMKFJ12/orders/' + order.id).then(function(data) {
              var fullOrder = data && data.order ? data.order : null;
              if (fullOrder) {
                fullOrder.custom_modified = order.modified;
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

    deferred.resolve(Q.all(fetchPromises));
  }, function() {
    deferred.reject('Orders API request failed');
  });

  return deferred.promise;
}

// ------ Routes ------
function allOrders(req, res) {
  batchOrder(req.query).then(function(data) {
    res.send(data);
  }, function() {
    res.send(500);
  });
}


exports.init = function(server) {
  db.open(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('Connected to clover database');
    }
  });
  server.get('/all-orders/*', allOrders);
};