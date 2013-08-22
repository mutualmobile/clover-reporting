define(function(require) {
  var BaseView = require('./BaseView'),
      debounce = require('mout/function/debounce');

  require('rdust!templates/mobile_charts');

  var MobileChartsView = BaseView.extend(function MobileChartsView() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      model: {
        dataChange: debounce(_onDataChange.bind(this), 0)
      }
    });
    this.render();
  }, {
    template: 'templates/mobile_charts',
    className: 'mobile_charts'
  });

  // Event handlers
  function _onDataChange() {
    this.redraw();
  }

  return MobileChartsView;
});