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

// ------ Utility functions ------
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

// ----------- Routes ------------
// Note that all route functions return
// a promise, so they can be used either
// directly as a normal route by express
// or by other functions which may just
// need their data
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

  makeRequest('/v2/merchant/RZC2F4FMKFJ12/orders', req.query).then(function(data) {
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
          if (item && item.modified === order.modified) {
            deferred.resolve(item);
          } else {
            makeRequest('/v2/merchant/RZC2F4FMKFJ12/orders/' + order.id).then(function(data) {
              var fullOrder = data && data.order ? data.order : null;
              if (fullOrder) {
                fullOrder = extend({}, order, fullOrder);
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

  makeRequest('/v2/merchant/RZC2F4FMKFJ12/inventory/categories', req.query).then(function(data) {
    var categories = data && data.categories ? data.categories : [],
        collection = db.collection('categories'),
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
            makeRequest('/v2/merchant/RZC2F4FMKFJ12/inventory/categories/' + category.id).then(function(data) {
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
function revenueByItem(req, res) {
  var totals = {},
      data = [],
      deferred = Q.defer(),
      employeeId = req.employeeId;

  allOrders(req).then(function(orders) {
    orders.forEach(function(order) {
      var lineItems = order.lineItems || [];

      // Filters
      if (employeeId && order.employeeId !== employeeId) { return; }

      lineItems.forEach(function(lineItem) {
        var revenue = revenueForLineItem(lineItem),
            itemId = lineItem.itemId || 'manual';
        if (!totals[itemId]) {
          totals[itemId] = {
            id: itemId,
            name: lineItem.name,
            total: 0,
            count: 0
          };
        }
        totals[itemId].total += revenue;
        totals[itemId].count++;
      });
    });
    for (var item in totals) {
      data.push(totals[item]);
    }
    if (res) {
      res.send(data);
    }
    deferred.resolve(data);
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject();
  });
  return deferred.promise;
}
function revenueByCategory(req, res) {
  var totals = {},
      data = [],
      fetches = [allCategories(req), revenueByItem(req)],
      deferred = Q.defer();

  Q.all(fetches).then(function(respone) {
    var categories = respone[0],
        revenueByItemArr = respone[1],
        revenueByItem = {};

    // Convert revenue by item data from an array of objects into
    // nested objects where each key is the object id, so that we
    // don't have to continually loop through the array
    revenueByItemArr.forEach(function(obj) {
      revenueByItem[obj.id] = obj;
    });

    categories.forEach(function(category) {
      category.items.forEach(function(item) {
        var itemRevenue = revenueByItem[item.id];
        if (itemRevenue) {
          if (!totals[category.id]) {
            totals[category.id] = {
              id: category.id,
              name: category.name,
              total: 0,
              count: 0
              // items: []
            };
          }
          totals[category.id].total += itemRevenue.total;
          totals[category.id].count += itemRevenue.count;
          // totals[category.id].items.push(itemRevenue);
        }
      });
    });
    for (var category in totals) {
      data.push(totals[category]);
    }
    if (res) {
      res.send(data);
    }
    deferred.resolve(data);
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject();
  });
  return deferred.promise;
}
function employeeData(req, res) {
  var totals = {},
      totalRevenue = 0,
      data = [],
      fetches = [],
      deferred = Q.defer();

  allOrders(req).then(function(orders) {
    orders.forEach(function(order) {
      var employeeId = order.employeeId,
          revenueByCategoryFetch,
          revenueByItemFetch;
      if (!totals[employeeId]) {
        totals[employeeId] = {
          id: employeeId,
          name: order.employeeName,
          total: 0,
          count: 0,
          percent: 0,
          orderCount: 0,
          firstOrder: Number.MAX_VALUE,
          lastOrder: Number.MIN_VALUE
        };
        req.employeeId = employeeId;
        revenueByCategoryFetch = revenueByCategory(req);
        revenueByCategoryFetch.then(function(data) {
          totals[employeeId].revenueByCategory = data;
        });
        revenueByItemFetch = revenueByItem(req);
        revenueByItemFetch.then(function(items) {
          items.sort(function(a, b) {
            return b.total - a.total;
          });
          totals[employeeId].revenueByItem = items;
          items.forEach(function(item) {
            totals[employeeId].total += item.total;
            totals[employeeId].count += item.count;
            totalRevenue += item.total;
          });
        });
        fetches.push(revenueByCategoryFetch, revenueByItemFetch);
      }
      totals[employeeId].firstOrder = Math.min(totals[employeeId].firstOrder, order.timestamp);
      totals[employeeId].lastOrder = Math.max(totals[employeeId].lastOrder, order.modified);
      totals[employeeId].orderCount++;
    });
    Q.all(fetches).then(function() {
      var item,
          highestPercent = 0;
      for (item in totals) {
        totals[item].percent = totals[item].total / totalRevenue;
        highestPercent = Math.max(totals[item].percent, highestPercent);
      }
      for (item in totals) {
        totals[item].relativePercent = totals[item].percent / highestPercent;
        data.push(totals[item]);
      }
      data.sort(function(a, b) {
        return b.total - a.total;
      });
      if (res) {
        res.send(data);
      }
      deferred.resolve(data);
    });
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject();
  });
  return deferred.promise;
}
function productData(req, res) {
  var deferred = Q.defer(),
      fetches = [allOrders(req), revenueByItem(req)],
      data = [];

  Q.all(fetches).then(function(response) {
    var allOrders = response[0],
        revenueByItem = response[1],
        totalRevenue = 0,
        items = {},
        highestPercent = 0,
        item;

    // Add attributes to item objects
    revenueByItem.forEach(function(item) {
      totalRevenue += item.total;
    });
    revenueByItem.forEach(function(item) {
      item.percent = item.total / totalRevenue;
      item.orderIds = {};
      item.employeeIds = {};
      item.firstOrder = Number.MAX_VALUE;
      item.lastOrder = Number.MIN_VALUE;
      items[item.id] = item;
      highestPercent = item.percent > highestPercent ? item.percent : highestPercent;
    });

    revenueByItem.forEach(function(item) {
      item.relativePercent = item.percent / highestPercent;
    });

    // Calculate order/employee data
    allOrders.forEach(function(order) {
      var lineItems = order.lineItems || [],
          reducedOrder = {
            id: order.id,
            timestamp: order.timestamp,
            modified: order.modified,
            employeeId: order.employeeId,
            employeeName: order.employeeName
          };
      lineItems.forEach(function(lineItem) {
        var revenue = revenueForLineItem(lineItem),
            item = items[lineItem.itemId] || items.manual;
        if (item) {
          // Update orders
          if (!item.orderIds[order.id]) {
            item.orderIds[order.id] = extend({total: 0, count: 0}, reducedOrder);
          }
          item.orderIds[order.id].total += revenue;
          item.orderIds[order.id].count += lineItem.qty;

          // Update employee
          if (!item.employeeIds[order.employeeId]) {
            item.employeeIds[order.employeeId] = extend({total: 0, count: 0}, {
              id: order.employeeId,
              name: order.employeeName
            });
          }
          item.employeeIds[order.employeeId].total += revenue;
          item.employeeIds[order.employeeId].count += lineItem.qty;
          item.firstOrder = Math.min(item.firstOrder, order.timestamp);
          item.lastOrder = Math.max(item.lastOrder, order.modified);
        }
      });
    });

    // Re-format objects as arrays
    for (var itemId in items) {
      item = items[itemId];
      // Orders
      item.orders = [];
      for (var orderId in item.orderIds) {
        item.orders.push(item.orderIds[orderId]);
      }
      item.orders.sort(function(a, b) {
        return b.modified - a.modified;
      });
      delete item.orderIds;

      // Employees
      item.employees = [];
      for (var employeeId in item.employeeIds) {
        item.employees.push(item.employeeIds[employeeId]);
      }
      item.employees.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      delete item.employeeIds;

      data.push(item);
    }
    data.sort(function(a, b) {
      return b.total - a.total;
    });

    if (res) {
      res.send(data);
    }
    deferred.resolve(data);
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject();
  });

  return deferred.promise;
}

exports.init = function(server) {
  db.open(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('Connected to clover database');
    }
  });
  server.get('/all-orders', allOrders);
  server.get('/all-categories', allCategories);
  server.get('/revenue-by-item', revenueByItem);
  server.get('/revenue-by-category', revenueByCategory);
  server.get('/employee-data', employeeData);
  server.get('/product-data', productData);
};