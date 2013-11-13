define(function(require) {
  // When running in a real worker, this source will
  // be injected into the worker source (see Worker.js)
  // and expose the xhr function globally
  var xhr = require('app/workers/source/xhr');

  // When used in a FakeWorker, 'self' will be
  // passed in and will expose 'onmessage' and
  // 'postMessage' functions. In the context of
  // a WebWorker, 'self' will refer to the built-in
  // global object.
  return function(self) {
    var handles = {},
        data = '[]',
        url, lastFetch, fetchTimer, startTime, endTime, lastHash;

    // --------- Direct calls from the main thread ---------

    function setURL(newURL) {
      url = newURL;
      fetch();
    }

    function setTimeRange(start, end) {
      if (start !== startTime || end !== endTime) {
        startTime = start;
        endTime = end;
        data = '[]';
        lastHash = null;
        sendStatus('loading');
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
      handleData.forEach(function(handle) {
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
        return data.filter(function(item) {
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
      var fullUrl;
      if (url) {
        cancel();
        fullUrl = url + '&start_time=' + startTime + '&end_time=' + endTime + '&count=' + 999999;
        lastFetch = xhr(fullUrl)
          .success(function(newData, newHash) {
            if (newData && newHash !== lastHash) {
              data = newData;
              lastHash = newHash;
              update();
            }
            sendStatus('ready');
            fetchTimer = setTimeout(fetch, 30000);
          })
          .error(function() {
            sendStatus('error');
            fetchTimer = setTimeout(fetch, 6000);
          });
      }
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
    self.onmessage = function(e) {
      var method = e.data.method,
          data = e.data.data;
      if (method === 'setTimeRange') {
        setTimeRange(data.startTime, data.endTime);
      } else if (handlerMethods.indexOf(method) > -1) {
        addHandler(data.id, method, data.fn, data.args || null);
      } else if (method === 'reset') {
        reset();
      } else if (method === 'setURL') {
        setURL(data);
      }
    };
  };
});