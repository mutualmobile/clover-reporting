define(function(require) {
  var BaseView = require('app/ui/BaseView'),
      DetailMetricsView = require('app/ui/collections/detail/child/DetailMetricsView'),
      SmallPieChartView = require('app/ui/charts/pie/SmallPieChartView'),
      SmallRevenueOverTimeBarView = require('app/ui/charts/time/SmallRevenueOverTimeBarView'),
      RevenueOverTimeBarView = require('app/ui/charts/time/RevenueOverTimeBarView'),
      DetailMetricsPanelView = require('app/ui/collections/detail/child/DetailMetricsPanelView'),
      DetailCategoriesPanelView = require('app/ui/collections/detail/child/DetailCategoriesPanelView'),
      $ = require('$'),
      tracker = require('app/analytics/tracker');
  require('rdust!templates/detail');

  /**
   * Collection Detail View
   * @class app.ui.collections.detail.CollectionDetailView
   * @extends app.ui.BaseView
   */
  var CollectionDetailView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      '.detail-info > [data-panel], .mobile-tabs [data-panel]': {
        tap: _onTapTab.bind(this)
      }
    });
  }, {
    template: 'templates/detail',
    className: 'detail',
    mapDetailViews: function(overTimeModel, categorizedModel) {
      this.mapChildView({
        '.overview': {
          TView: DetailMetricsView
        },
        '.revenue-by-category': {
          TView: SmallPieChartView,
          model: categorizedModel
        },
        '.bar-chart .inner': {
          TView: SmallRevenueOverTimeBarView,
          model: overTimeModel
        },
        '.bar-chart-full': {
          TView: RevenueOverTimeBarView,
          model: overTimeModel
        },
        '.metrics': {
          TView: DetailMetricsPanelView
        },
        '.pie-chart-full': {
          TView: DetailCategoriesPanelView,
          model: categorizedModel
        }
      });
    },
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
        currentViewLabel = tracker.getCurrentPageLabel(),
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
      tracker.trackEvent(currentViewLabel + '_Data',
                         'DataDrillDown',
                         tab.attr('data-tracker-label'),
                         tab.parents('.detail').index() + 1 // rank
                         );
    }
  }

  return CollectionDetailView;

});