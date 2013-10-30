define(function(require) {
  var Disposable = require('lavaca/util/Disposable'),
      uuid = require('lavaca/util/uuid');

  var DataHandle = Disposable.extend(function DataHandle(worker) {
    Disposable.apply(this, arguments);
    this._id = uuid();
    this._worker = worker;
    this._handlers = {};
    this._messageHandler = _onWorkerMessage.bind(this);
    worker.addMessageHandler(this._messageHandler);
  }, {
    map: function(cb) {
      return _addOperation.call(this, 'map', cb);
    },
    reduce: function(cb, initialValue) {
      return _addOperation.call(this, 'reduce', cb, initialValue);
    },
    success: function(cb) {
      _addOperation.call(this, 'success');
      return _addHandler.call(this, 'success', cb);
    },
    error: function(cb) {
      _addOperation.call(this, 'error');
      return _addHandler.call(this, 'error', cb);
    },
    then: function(success, error) {
      return this.success(success).error(error);
    },
    always: function(cb) {
      return this.then(cb, cb);
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

  function _addHandler(type, cb) {
    if (!this._handlers[type]) {
      this._handlers[type] = [];
    }
    this._handlers[type].push(cb);
    return this; // chaining
  }

  function _callHandlers(type, message) {
    var handlers = this._handlers[type];
    if (handlers) {
      handlers.forEach(function(handler) {
        handler.call(this, message);
      }.bind(this));
    }
  }

  // Event Handlers
  function _onWorkerMessage(e) {
    var data = e.data,
        id = parseInt(data.id, 10);
    if (id === this._id || data.status === 'error') {
      _callHandlers.call(this, data.status, data.result);
    }
  }

  return DataHandle;
});