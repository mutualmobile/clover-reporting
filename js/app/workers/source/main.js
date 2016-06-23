define(function (require) {
  // When running in a real worker, this source will
  // be injected into the worker source (see Worker.js)
  // and expose the xhr function globally
  var xhr = require('app/workers/source/xhr');

  // When used in a FakeWorker, 'self' will be
  // passed in and will expose 'onmessage' and
  // 'postMessage' functions. In the context of
  // a WebWorker, 'self' will refer to the built-in
  // global object.
  return function (self) {

    var handles = {},
      data = '[]',
      orders = [],
      offset = 0,
      maxOrdersPreRequest = 1000,
      totalReturned = 0,
      refreshTimeout,
      url, lastFetch, fetchTimer, startTime, endTime, lastHash, delayFetchTimer;

    // --------- Direct calls from the main thread ---------

    function setURL(newURL) {
      url = newURL;
      fetch();
    }

    function setTimeRange(start, end) {
      if (start !== startTime || end !== endTime) {
        startTime = start;
        endTime = end;
        orders = [];
        updateView();
        lastHash = null;
        sendStatus('loading');
        offset = 0;
        fetch();
      }
    }

    function addHandler(id, method, callback, args) {
      if (!handles[id]) {
        handles[id] = [];
      }
      // When a 'done' callback is attached, we send
      // a message to the WebWorker so that it can run through
      // the handlers immediately, in case there is already
      // data loaded
      if (method === 'done') {
        processHandle(id);
      } else {
        handles[id].push({
          method: method,
          cb: funcFromSource(callback),
          args: args
        });
      }
    }

    // ------------------- Process Data --------------------

    // Update all DataHandles
    function update() {
      for (var id in handles) {
        processHandle(id);
      }
    }

    // Update a single DataHandle
    function processHandle(id) {
      var result = JSON.parse(data),
        handleData = handles[id];
      if (!result || !result.orders) {
        result = [];
      } else {
        result = result.orders;
      }

      handleData.forEach(function (handle) {
        var method = handle.method;
        if (method === 'map') {
          result = map(result, handle.cb);
        } else if (method === 'reduce') {
          // JSON encode then decode the initialValue to "copy"
          // it in case the reduce function modifies it
          result = reduce(result, handle.cb, JSON.parse(JSON.stringify(handle.args)));
        } else if (method === 'sort') {
          result = sort(result, handle.cb);
        } else if (method === 'filter') {
          result = filter(result, handle.cb, handle.args);
        } else if (method === 'process') {
          result = process(result, handle.cb, handle.args);
        }
      });
      sendDone(id, result);
    }

    function map(data, cb) {
      data = Array.isArray(data) ? data : [];
      return data.map(cb);
    }

    function reduce(data, cb, initialValue) {
      data = Array.isArray(data) ? data : [];
      return data.reduce(cb, initialValue);
    }

    function sort(data, cb) {
      return data.slice(0).sort(cb);
    }

    function filter(data, cb, args) {
      if (!args || args.length === 0) {
        return data.filter(cb);
      } else {
        args = Array.isArray(args) ? args : [args];
        return data.filter(function (item) {
          return cb.apply(this, [item].concat(args));
        });
      }
    }

    function process(data, cb, args) {
      if (!args || args.length === 0) {
        return cb(data);
      } else {
        args = Array.isArray(args) ? args : [args];
        return cb.apply(this, [data].concat(args));
      }
    }

    // --------------------- Fetching ----------------------

    function fetch() {
      if (!url) return;
      cancel();
      clearTimeout(delayFetchTimer);
      delayFetchTimer = setTimeout(function () {
        (function fetchPart() {
          var fullUrl = url +
            '&start_time=' + startTime +
            '&end_time=' + endTime +
            '&count=' + maxOrdersPreRequest +
            '&offset=' + offset;

          sendStatus('loading');
          lastFetch = xhr(fullUrl)
            .success(function (response) {
              var parsedResponse = JSON.parse(response);
              var numReturned = parsedResponse.orders.length;

              offset += numReturned;
              totalReturned += numReturned;
              sendStatus('ready');

              if (numReturned != 0 || totalReturned == 0) {
                parsedResponse.orders.map(function (order) {
                  orders.push(order);
                });

                updateView();

                delayFetchTimer = setTimeout(fetchPart, totalReturned == 0 ? 0 : 5000);
              } else {
                clearTimeout(delayFetchTimer);
                refreshTimeout = setTimeout(refresh, 5000);
              }
            })
            .error(function () {
              sendStatus('error');
              delayFetchTimer = setTimeout(fetchPart, 6000);
            });
        })();
      }, 500);
    }

    function refresh() {
      clearTimeout(refreshTimeout);

      var fullUrl = url +
        '&start_time=' + startTime +
        '&end_time=' + endTime +
        '&count=' + maxOrdersPreRequest +
        '&offset=0';

      xhr(fullUrl).success(function (response) {
        var refreshedOrders = JSON.parse(response).orders;

        if (refreshedOrders.length > 0) {
          var i = 0;
          var ordersToPrepend = [];
          while (refreshedOrders[i].id != orders[0].id && refreshedOrders[i].paymentState == 'PAID') {
            ordersToPrepend.push(refreshedOrders[i]);
            i++;
          }

          if (ordersToPrepend.length > 0) {
            ordersToPrepend.reverse().forEach(function (order) {
              orders.unshift(order);
            });

            updateView();
          }
        }
      }).always(function () {
        refreshTimeout = setTimeout(refresh, 5000);
      });
    }

    function updateView() {
      data = JSON.stringify({ orders: filterDeletedOrders(orders) });
      update()
    }

    function filterDeletedOrders(orders) {
      return orders.filter(function (order) {
        return !order.isDeleted && order.paymentState == 'PAID';
      });
    }

    function cancel() {
      clearTimeout(fetchTimer);
      if (lastFetch) {
        lastFetch.abort();
      }
    }

    function reset() {
      cancel();
      lastHash = null;
      data = '[]';
      update();
    }

    // ------------------ Message Sending -------------------

    function sendDone(id, result) {
      self.postMessage({
        type: 'done',
        id: id,
        result: result
      });
    }

    function sendStatus(status) {
      self.postMessage({
        type: 'status',
        status: status
      });
    }

    // In a WebWorker, functions are passed as strings
    // and converted back to functions using the Function
    // constructor, which is much faster than eval and has
    // nearly identical performance to normally-declared
    // functions. In a FakeWorker, functions will be passed
    // as normal functions and this is a no-op.
    function funcFromSource(src) {
      if (typeof src === 'string') {
        return (new Function('return(' + src + ')')());
      } else { // normal function
        return src;
      }
    }

    // --------------- Process client message ----------------

    var handlerMethods = ['map', 'reduce', 'sort', 'process', 'filter', 'done'];
    self.onmessage = function (e) {
      var method = e.data.method,
        data = e.data.data;
      if (method === 'setTimeRange') {
        setTimeRange(data.startTime, data.endTime);
      } else if (handlerMethods.indexOf(method) > -1) {
        addHandler(data.id, method, data.fn, data.args);
      } else if (method === 'reset') {
        reset();
      } else if (method === 'setURL') {
        setURL(data);
      }
    };
  };
});