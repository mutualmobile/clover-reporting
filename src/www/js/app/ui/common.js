define(function(require) {

  var Spinner = require('app/ui/widgets/Spinner');

  var data = {
    mapGlobals: function() {
      this.mapWidget({
        '.loading-spinner': Spinner
      });
    }
  };

  return data;
});