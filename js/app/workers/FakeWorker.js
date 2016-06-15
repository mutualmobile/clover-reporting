define(function(require) {
  var Disposable = require('lavaca/util/Disposable'),
      remove = require('mout/array/remove');

  var FakeWorker = Disposable.extend(function FakeWorker(source) {
    Disposable.apply(this, arguments);
    this._messageHandlers = [];
    this._context = _createContext(this);
    setTimeout(source, 0, this._context);
  }, {
    postMessage: function(data) {
      setTimeout(function() {
        if (this._context.onmessage) {
          this._context.onmessage(_createEvent.call(this, data));
        }
      }.bind(this));
    },
    addEventListener: function(type, cb) {
      if (type === 'message') {
        this._messageHandlers.push(cb);
      }
    },
    removeEventListener: function(type, cb) {
      if (type === 'message') {
        remove(this._messageHandlers, cb);
      }
    }
  });

  // Utility functions

  function _createContext(worker) {
    return {
      postMessage: function(data) {
        setTimeout(function() {
          worker._messageHandlers.forEach(function(handler) {
            handler(_createEvent.call(this, data));
          });
        }, 0);
      }
    };
  }

  function _createEvent(data) {
    return {
      target: this,
      currentTarget: this,
      type: 'message',
      data: data,
      preventDefault: function() {},
      stopPropagation: function() {}
    };
  }

  return FakeWorker;
});