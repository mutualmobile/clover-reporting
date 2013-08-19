define(function(require) {

  var BaseView = require('app/ui/views/BaseView'),
      debounce = require('mout/function/debounce'),
      $ = require('$'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/page_menu');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.PageMenuView
   * @extends app.ui.views.BaseView
   */
  var PageMenuView = BaseView.extend(function PageMenuView() {
    BaseView.apply(this, arguments);
    var debouncedChangeHandler = debounce(this.updateMenu.bind(this), 0);
    this.mapEvent({
      li: {
        tap: _onTapLink.bind(this)
      },
      self: {
        tap: _onTapPageMenu.bind(this)
      },
      model: {
        change: debouncedChangeHandler
      }
    });
    this.render();
  }, {
    template: 'templates/page_menu',
    className: 'page_menu',
    updateMenu: function() {
      this.redraw();
    }
  });

  function _onTapLink(e) {
    var link = $(e.currentTarget).data('href');
    if (link) {
      router.exec(link);
    }
  }

  function _onTapPageMenu() {
    this.el.find('.popover').toggleClass('active');
  }

  return PageMenuView;

});