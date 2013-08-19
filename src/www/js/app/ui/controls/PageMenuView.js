define(function(require) {

  var PopoverControlView = require('app/ui/controls/PopoverControlView'),
      $ = require('$'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/page_menu');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.PageMenuView
   * @extends app.ui.views.BaseView
   */
  var PageMenuView = PopoverControlView.extend(function PageMenuView() {
    PopoverControlView.apply(this, arguments);
    this.mapEvent({
      li: {
        tap: _onTapLink.bind(this)
      }
    });
    this.render();
  }, {
    template: 'templates/page_menu',
    className: 'page_menu'
  });

  function _onTapLink(e) {
    var link = $(e.currentTarget).data('href');
    if (link) {
      router.exec(link);
    }
  }

  return PageMenuView;

});