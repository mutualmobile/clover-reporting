define(function() {

  // Executes a GET request to the specified
  // url and returns a promise. This function
  // is exposed globally in the web worker context.
  return function xhr(url) {
    var req = new XMLHttpRequest(),
        success = null,
        aborted = false,
        successHandlers = [],
        errorHandlers = [],
        response,
        getNonDeletedOrders,
        responseHash;

    function processHandlers() {
      var handlers = success ?  successHandlers : errorHandlers;
      handlers.forEach(function(handler) {
        handler.call(req, response, responseHash);
      });
      successHandlers = errorHandlers = null;
    }

    req.open('GET', url);
    req.onreadystatechange = function () {
      if (req.readyState === 4 && !aborted) {
        if (req.status >= 200 && req.status < 300 || req.status === 304) {
          success = true;
        } else {
          success = false;
        }
        response = req.responseText ? req.responseText : 'null';
        responseHash = hash(response);
        processHandlers();
      }
    };
    req.send();


    function hash(s) {
      return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }

    var promise = {
      success: function(cb) {
        if (success === true) {
          cb.call(req, response, responseHash);
        } else {
          successHandlers.push(cb);
        }
        return this;
      },
      error: function(cb) {
        if (success === false) {
          cb.call(req, response, responseHash);
        } else {
          errorHandlers.push(cb);
        }
        return this;
      },
      always: function(cb) {
        return this.success(cb).error(cb);
      },
      then: function(success, error) {
        this.success(success);
        if (error) {
          this.error(error);
        }
        return this;
      },
      abort: function() {
        aborted = true;
        req.abort(0);
      }
    };

    return promise;
  };
});