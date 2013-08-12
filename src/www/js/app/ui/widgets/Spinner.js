define(function(require) {
  var Widget = require('lavaca/ui/Widget'),
      $ = require('jquery'),
      merge = require('mout/object/merge');
  require('jquery-spin');

  var Spinner = Widget.extend(function Spinner(el, options) {
    Widget.apply(this, arguments);

    var opts = this.defaults,
        ie8 = $('html').hasClass('ie8');
    if (options) {
      opts = merge(this.defaults, options);
    }
    setTimeout(function() {
      if (this && this.el) {
        this.el.spin(opts);
      }
    }.bind(this), ie8 ? 500 : 0);
  }, {
    defaults: {
      color: '#fff',
      left: 'auto',
      top: 'auto'
    }
  });

  return Spinner;
});