define(function(require) {

  var BaseView = require('app/ui/views/BaseView'),
      batchCalls = require('app/misc/batch_calls'),
      $ = require('$');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.PopoverControlView
   * @extends app.ui.views.BaseView
   */
  var PopoverControlView = BaseView.extend(function PopoverControlView() {
    BaseView.apply(this, arguments);
    var batchedChangeHandler = batchCalls(this.updateMenu, this);
    this.mapEvent({
      self: {
        tap: _onTapPageMenu.bind(this)
      },
      model: {
        change: batchedChangeHandler
      }
    });
    this.render();
  }, {
    updateMenu: function() {
      this.redraw();
    },
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

  function _onTapPageMenu() {
    if (!this.el.find('.popover').hasClass('active')) {
      this.open.call(this);
    }
  }

  return PopoverControlView;

});