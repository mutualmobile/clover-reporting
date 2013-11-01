define(function(require) {
  // When running in a real worker, this source
  // will be injected into the worker source
  // and expose the xhr function globally
  var xhr = require('app/workers/source/xhr');

  // When used in a FakeWorker, 'self' will be
  // passed in and will expose 'onmessage' and
  // 'postMessage' functions. In the context of
  // a WebWorker, only the function body will
  // be used and 'self' will refer to the built-in
  // global object.
  return function(self) {
    var handles = {},
        data = [],
        url, lastFetch, fetchTimer, startTime, endTime, lastHash;

    // --------- Direct calls from the main thread ---------

    function setURL(newURL) {
      url = newURL;
    }

    function setTimeRange(start, end) {
      if (start !== startTime || end !== endTime) {
        startTime = start;
        endTime = end;
        sendStatus('loading');
        fetch();
      }
    }

    function addHandler(id, method, callback, initialValue) {
      if (!handles[id]) {
        handles[id] = [];
      }
      // When a 'done' callback is attached, we send
      // a message to the WebWorker so that it can run through
      // the handlers immediately, in case there is already
      // data loaded
      if (method === 'done') {
        processHandle(id, handles[id]);
      } else {
        handles[id].push({
          method: method,
          cb: funcFromSource(callback),
          initialValue: initialValue
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
      var result = data,
          handleData = handles[id];
      handleData.forEach(function(handle) {
        var method = handle.method;
        if (method === 'map') {
          result = map(result, handle.cb);
        } else if (method === 'reduce') {
          // JSON encode then decode the initialValue to "copy"
          // it in case the reduce function modifies it
          result = reduce(result, handle.cb, JSON.parse(JSON.stringify(handle.initialValue)));
        } else if (method === 'sort') {
          result = sort(result, handle.cb);
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

    // --------------------- Fetching ----------------------

    function fetch() {
      var fullUrl;
      if (url) {
        cancel();
        fullUrl = url + '&start_time=' + startTime + '&end_time=' + endTime;
        lastFetch = xhr(fullUrl)
          .success(function(newData, newHash) {
            if (newData && newData.orders && newHash !== lastHash) {
              data = newData.orders;
              lastHash = newHash;
              update();
            }
            sendStatus('ready');
          })
          .error(function() {
            sendStatus('error');
          })
          .always(function() {
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
      data = [];
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
        status: 'status'
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

    var handlerMethods = ['map', 'reduce', 'sort', 'done'];
    self.onmessage = function(e) {
      var method = e.data.method,
          data = e.data.data;
      if (method === 'setTimeRange') {
        setTimeRange(data.startTime, data.endTime);
      } else if (handlerMethods.indexOf(method) > -1) {
        addHandler(data.id, method, data.fn, data.initialValue);
      } else if (method === 'reset') {
        reset();
      } else if (method === 'setURL') {
        setURL(data);
      }
    };
  };
});