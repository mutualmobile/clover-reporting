define(function(require) {
  var Widget = require('lavaca/ui/Widget'),
      $ = require('$'),
      merge = require('mout/object/merge');
  require('jquery-spin');

  var Spinner = Widget.extend(function Spinner(el, options) {
    Widget.apply(this, arguments);

    var opts = this.defaults;
    if (options) {
      opts = merge(this.defaults, options);
    }
    setTimeout(function() {
      if (this && this.el) {
        this.el.spin(opts);
      }
    }.bind(this), 0);
  }, {
    defaults: {
      color: '#fff',
      left: 'auto',
      top: 'auto'
    }
  });

  return Spinner;
});