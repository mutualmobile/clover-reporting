define(function(require) {
  var Disposable = require('lavaca/util/Disposable'),
      uuid = require('lavaca/util/uuid');

  var DataHandle = Disposable.extend(function DataHandle(worker) {
    Disposable.apply(this, arguments);
    this._id = uuid();
    this._worker = worker;
    this._handlers = [];
    this._messageHandler = _onWorkerMessage.bind(this);
    worker.addMessageHandler(this._messageHandler);
  }, {
    map: function(cb) {
      return _addOperation.call(this, 'map', cb);
    },
    reduce: function(cb, initialValue) {
      return _addOperation.call(this, 'reduce', cb, initialValue);
    },
    sort: function(cb) {
      return _addOperation.call(this, 'sort', cb);
    },
    process: function(cb) {
      return _addOperation.call(this, 'process', cb);
    },
    done: function(cb) {
      _addHandler.call(this, cb);
      return _addOperation.call(this, 'done');
    },
    dispose: function() {
      this._worker.removeMessageHandler(this._messageHandler);
      return Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  // Private functions
  function _addOperation(type, fn, initialValue) {
    this._worker.send(type, {
      id: this._id,
      fn: fn,
      initialValue: initialValue
    });
    return this; // chaining
  }

  function _addHandler(cb) {
    this._handlers.push(cb);
  }

  function _callDoneHandlers(message) {
    this._handlers.forEach(function(handler) {
      handler.call(this, message);
    }.bind(this));
  }

  // Event Handlers
  function _onWorkerMessage(e) {
    var data = e.data,
        id = parseInt(data.id, 10);
    if (id === this._id && data.type === 'done') {
      _callDoneHandlers.call(this, data.result);
    }
  }

  return DataHandle;
});