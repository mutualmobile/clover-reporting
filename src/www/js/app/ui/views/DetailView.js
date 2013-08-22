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
      '.detail-info > [data-panel], .mobile-tabs [data-panel]': {
        tap: _onTapTab.bind(this)
      }
    });
  }, {
    template: 'templates/detail',
    className: 'detail',
    redraw: function() {
      var activePanel = this.el.find('[data-panel].active').attr('data-panel');
      return BaseView.prototype.redraw.apply(this, arguments).then(function() {
        this.el.find('[data-panel="' + activePanel + '"]').addClass('active');
      }.bind(this));
    }
  });

  function _onTapTab(e) {
    var tab = $(e.currentTarget),
        panel = tab.data('panel'),
        shouldClose = tab.hasClass('active'),
        isMainTab = tab.hasClass('main-tab'),
        tabViews;

    $('[data-active-panel]')
      .not(this.el)
      .removeClass('detail-panel-active')
      .find('.active')
        .removeClass('active');

    if (isMainTab && $('.mobile-tabs:visible').length) {
      shouldClose = true;
    } else if (!isMainTab && shouldClose) {
      return;
    }

    if (shouldClose) {
      this.el.removeClass('detail-panel-active');
      this.el.attr('data-active-panel', null);
      this.el.find('[data-panel].active').removeClass('active');
    } else {
      this.el.addClass('detail-panel-active');
      this.el.attr('data-active-panel', panel);
      this.el.find('[data-panel="' + panel + '"]')
        .addClass('active')
        .siblings()
        .removeClass('active');
      tabViews = this.el.find('.detail-panel[data-panel="' + panel + '"] [data-view-id]');
      tabViews.each(function() {
        var $el = $(this),
            view = $el.data('view');
        if (view && view.updateChart) {
          setTimeout(function() {
            view.updateChart();
          });
        }
      });
    }
  }

  return DetailView;

});