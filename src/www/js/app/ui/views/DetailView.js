define(function(require) {
  var BaseView = require('./BaseView'),
      $ = require('$');

  require('rdust!templates/detail');

  /**
   * Employee Detail View
   * @class app.ui.views.DetailView
   * @extends app.ui.views.BaseView
   */
  var DetailView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      '.detail-info > [data-panel]': {
        tap: _onTapTab.bind(this)
      }
    });
  }, {
    template: 'templates/detail',
    className: 'detail',
    openPanel: function(panel) {
      this.el.addClass('detail-panel-active');
      this.el.attr('data-active-panel', panel);
      this.trigger(panel);
    },
    closePanel: function() {
      this.el.removeClass('detail-panel-active');
      this.el.attr('data-active-panel', null);
    }
  });

  function _onTapTab(e) {
    var tab = $(e.currentTarget),
        panel = tab.data('panel');
    $('[data-active-panel]')
      .removeClass('detail-panel-active')
      .find('.active')
        .removeClass('active');
    tab
      .toggleClass('active')
      .siblings()
        .removeClass('active');
    if (tab.hasClass('active')) {
      this.openPanel.call(this, panel);
    } else {
      this.closePanel.call(this, panel);
    }
  }

  return DetailView;

});