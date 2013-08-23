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
    limiter = new RateLimiter(13, 'second');

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
  query.count = 999999999;
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