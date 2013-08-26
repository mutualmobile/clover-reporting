define(function() {

  return function(fn, context) {
    var scheduled = false,
        args,
        oldDispose;

    if (context && context.dispose) {
      oldDispose = context.dispose;
      context.dispose = function() {
        this._disposed = true;
        oldDispose.apply(this, arguments);
      };
    }

    return function() {
      var self = this;
      args = Array.prototype.slice.call(arguments, 0);
      if (!scheduled) {
        setTimeout(function() {
          if (!context || !context._disposed) {
            fn.apply(context || self, args);
          }
          scheduled = false;
        }, 0);
      }
      scheduled = true;
    };
  };

});