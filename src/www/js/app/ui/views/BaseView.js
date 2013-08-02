define(function(require) {

  var View = require('lavaca/mvc/View'),
      common = require('app/ui/common');
  require('lavaca/fx/Animation'); //jquery plugins

  /**
   * A View from which all other application Views can extend.
   * Adds support for animating between views.
   *
   * @class app.ui.views.BaseView
   * @extends Lavaca.mvc.View
   *
   */
  var BaseView = View.extend(function() {
    View.apply(this, arguments);
    common.mapGlobals.call(this);
  });

  return BaseView;

});
