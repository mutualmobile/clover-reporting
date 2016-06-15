define(function(require) {
  var Widget = require('lavaca/ui/Widget'),
      merge = require('mout/object/merge'),
      stateModel = require('app/models/global/StateModel'),
      $ = require('$');
  require('jquery-spin');

  var LoadingSpinner = Widget.extend(function LoadingSpinner(el, options) {
    Widget.apply(this, arguments);

    // Listen for data status changes
    this._loadingChangeHandler = stateModel.on('change', 'dataStatus', _onLoadingStateChange.bind(this));
    _onLoadingStateChange.call(this);

    // Create spinner
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
    },
    dispose: function() {
      stateModel.off(this._loadingChangeHandler);
      return Widget.prototype.dispose.apply(this, arguments);
    }
  });

  // Event handlers

  function _onLoadingStateChange() {
    var status = stateModel.get('dataStatus');
    this.el.toggleClass('loading', status === 'loading');
  }

  // Static methods

  LoadingSpinner.init = function() {
    return new LoadingSpinner($('#loading-spinner'));
  };

  return LoadingSpinner;

});