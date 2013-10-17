define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      batchCalls = require('app/misc/batch_calls'),
      $ = require('$');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.navigation.PopoverControlView
   * @extends app.ui.BaseView
   */
  var PopoverControlView = BaseView.extend(function PopoverControlView() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      self: {
        tap: _onTapPageMenu.bind(this)
      },
      model: {
        change: batchCalls(_updateMenu, this)
      }
    });
    this.render();
  }, {
    open: function() {
      setTimeout(function() {
        $(window).one('tap.'+this.id, function() {
          this.close();
        }.bind(this));
      }.bind(this));
      this.el.find('.popover').addClass('active');
    },
    close: function() {
      this.el.find('.popover').removeClass('active');
      $(window).off('tap.'+this.id);
    }
  });

  // Event handlers

  function _onTapPageMenu() {
    if (!this.el.find('.popover').hasClass('active')) {
      this.open.call(this);
    }
  }

  function _updateMenu() {
    this.redraw();
  }

  return PopoverControlView;

});