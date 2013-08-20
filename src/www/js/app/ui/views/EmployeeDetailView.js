define(function(require) {
  var BaseView = require('./BaseView'),
      Collection = require('lavaca/mvc/Collection'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      FilteredRevenueOverTimeView = require('app/ui/views/FilteredRevenueOverTimeView'),
      SmallRevenueByCategoryView = require('app/ui/views/SmallRevenueByCategoryView'),
      $ = require('$');

  require('rdust!templates/detail');

  /**
   * Employee Detail View
   * @class app.ui.views.EmployeeDetailView
   * @extends app.ui.views.BaseView
   */
  var EmployeeDetailView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      '[data-panel]': {
        tap: _onTapTab.bind(this)
      }
    });
    this.mapChildView({
      '.revenue-by-category': {
        TView: SmallRevenueByCategoryView,
        model: new Collection(this.model.get('revenueByCategory'))
      },
      '.bar-chart': {
        TView: FilteredRevenueOverTimeView,
        model: recentOrdersCollection
      }
    });
    this.render();
  }, {
    template: 'templates/detail',
    className: 'detail',
    openPanel: function(panel) {
      this.el.addClass('detail-panel-active');
      this.el.attr('data-active-panel', panel);
    },
    closePanel: function() {
      this.el.removeClass('detail-panel-active');
      this.el.attr('data-active-panel', null);
    }
  });

  function _onTapTab(e) {
    var tab = $(e.currentTarget),
        panel = tab.data('panel');
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

  return EmployeeDetailView;

});