(function() {
  var https = require('https'),
      url = require('url'),
      Q = require('q'),
      mongo = require('mongodb'),
      Server = mongo.Server,
      Db = mongo.Db,
      RateLimiter = require('limiter').RateLimiter;

  var baseURL = '/v2/merchant/',
      server = new Server('localhost', 27017, {auto_reconnect: true}),
      db = new Db('clover', server, {w: 'acknowledged'}),
      limiter = new RateLimiter(13, 'second'),
      requestQueue = [];

  function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          target[prop] = source[prop];
        }
      }
    });
    return target;
  }

  function makeRequest(path, req) {
    var options = {
          hostname: 'api.clover.com',
          port: 443,
          path: path,
          method: 'GET'
        },
        query,
        deferred = Q.defer();

    if (!req) {
      deferred.reject();
      return deferred.promise;
    }

    query = req.query || {};
    query.access_token = req.get('x-clover-access-token');
    query.count = 999999999;
    options.path = baseURL + req.get('x-clover-merchant-id') + '/' + options.path + url.format({query: query});

    requestQueue.push({
      deferred: deferred,
      path: path,
      req: req,
      options: options
    });
    limiter.removeTokens(1, processRequest);

    return deferred.promise;
  }

  function processRequest() {
    var request = requestQueue.shift(),
        deferred, path, req, options;

    while (request && !!request.req._hasClosed) {
      request = requestQueue.shift();
    }

    if (request) {
      deferred = request.deferred;
      path = request.path;
      req = request.req;
      options = request.options;

      https.get(options, function(apiRes) {
        console.log(options.path);
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
            deferred.resolve(makeRequest(path, req));
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
    }
  }

  function revenueForLineItem(lineItem) {
    var revenue = (lineItem.price * lineItem.qty) + lineItem.discountAmount;
    if (lineItem.taxable) {
      revenue += Math.round((lineItem.price * lineItem.qty) * (lineItem.taxRate / 10000000));
    }
    if (lineItem.refunded) {
      revenue = 0;
    }
    return revenue;
  }

  exports.extend = extend;
  exports.makeRequest = makeRequest;
  exports.revenueForLineItem = revenueForLineItem;
  exports.db = db;
})();