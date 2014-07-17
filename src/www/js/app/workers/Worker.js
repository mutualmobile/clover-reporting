define(function(require) {
  var Disposable = require('lavaca/util/Disposable'),
      FakeWorker = require('app/workers/FakeWorker'),
      main = require('app/workers/source/main'),
      xhr = require('app/workers/source/xhr'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem');

  var _URL = window.URL ? window.URL : window.webkitURL,
      _hasFullSupport = !!(window.Worker && _URL);

  var Worker = Disposable.extend(function Worker() {
    Disposable.apply(this, arguments);
    this._worker = _createWorker();
  }, {
    send: function(method, data) {
      this._worker.postMessage({
        method: method,
        data: _serialize(data)
      });
    },
    addMessageHandler: function(cb) {
      this._worker.addEventListener('message', cb);
    },
    removeMessageHandler: function(cb) {
      this._worker.removeEventListener('message', cb);
    }
  });

  // Utility functions

  function _createWorker() {
    if (_hasFullSupport) {
      return _createRealWorker();
    } else {
      _getWorkerSource();
      return _createFakeWorker();
    }
  }

  function _createRealWorker() {
    var blob = _makeBlob(_getWorkerSource(), 'text/javascript'),
        blobURL;
    if (blob) {
      blobURL = _URL.createObjectURL(blob);
      return new window.Worker(blobURL);
    }
    return _createFakeWorker();
  }

  function _createFakeWorker() {
    return new FakeWorker(main);
  }

  function _extractFunctionBody(fn) {
    var src = fn.toString();
    return src.substring(src.indexOf('{') + 1, src.lastIndexOf('}'));

  }

  function _getWorkerSource() {
    var imports = [xhr, revenueForLineItem],
        src = '';
    imports.forEach(function(anImport) {
      src += anImport + '\r\n';
    });
    src += _extractFunctionBody(main);
    return src;
  }

  function _makeBlob(data, datatype) {
    var out;
    try {
      out = new Blob([data], {type: datatype});
    } catch (e) {
      var BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder;
      if (e.name === 'TypeError' && BlobBuilder) {
        var bb = new BlobBuilder();
        bb.append(data);
        out = bb.getBlob(datatype);
      } else if (e.name === 'InvalidStateError') {
        out = new Blob([data], {type: datatype});
      }
    }
    return out;
  }

  function _serialize(data) {
    if (_hasFullSupport) {
      if (!data) {
        return data;
      } else if(typeof data === 'function') {
        return data.toString();
      } else if (Array.isArray(data)) {
        return data.map(_serialize);
      } else if (typeof data === 'object') {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            data[key] = _serialize(data[key]);
          }
        }
      }
    }
    return data;
  }

  return Worker;

});