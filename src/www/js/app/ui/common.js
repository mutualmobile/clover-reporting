define(function(require) {

  var Spinner = require('app/ui/widgets/Spinner');

  var data = {
    mapGlobals: function() {
      this.mapWidget({
        '.loading-spinner': {
          TWidget: Spinner,
          args: this.spinnerArgs
        }
      });
    }
  };

  return data;
});