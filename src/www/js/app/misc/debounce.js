define(function(require) {
  var debounce = require('mout/function/debounce');

  return function(fn, context, threshold) {
    var oldDispose = context.dispose;
    context.dispose = function() {
      this._disposed = true;
      oldDispose.apply(this, arguments);
    };

    var safeGuard = function() {
      if (!context._disposed) {
        fn.apply(context, arguments);
      }
    };

    return debounce(safeGuard, threshold);
  };
});