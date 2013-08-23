define(function(require) {

  var BaseView = require('app/ui/views/BaseView'),
      debounce = require('app/misc/debounce'),
      $ = require('$');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.PopoverControlView
   * @extends app.ui.views.BaseView
   */
  var PopoverControlView = BaseView.extend(function PopoverControlView() {
    BaseView.apply(this, arguments);
    var debouncedChangeHandler = debounce(this.updateMenu, this, 0);
    this.mapEvent({
      self: {
        tap: _onTapPageMenu.bind(this)
      },
      model: {
        change: debouncedChangeHandler
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