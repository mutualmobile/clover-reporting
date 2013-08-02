define(function(require) {

  var Spinner = require('app/ui/Widgets/Spinner');

  var data = {
    mapGlobals: function() {
      this.mapWidget({
        '.loading-spinner': Spinner
      });
    }
  };

  return data;
});