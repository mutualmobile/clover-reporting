define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      DetailMetricsView = require('app/ui/collections/detail/child/DetailMetricsView'),
      SmallRevenueByEmployeeView = require('app/ui/charts/pie/SmallRevenueByEmployeeView'),
      RevenueByCategoryModel = require('app/models/chart/RevenueByCategoryModel'),
      SmallRevenueOverTimeBarView = require('app/ui/charts/time/SmallRevenueOverTimeBarView'),
      RevenueOverTimeModel = require('app/models/chart/RevenueOverTimeModel'),
      RevenueOverTimeBarView = require('app/ui/charts/time/RevenueOverTimeBarView'),
      DetailCategoriesPanelView = require('app/ui/collections/detail/child/DetailCategoriesPanelView'),
      DetailMetricsPanelView = require('app/ui/collections/detail/child/DetailMetricsPanelView');

  /**
   * Employee Collection Detail View
   * @class app.ui.collections.detail.EmployeeCollectionDetailView
   * @extends app.ui.collections.detail.CollectionDetailView
   */
  var EmployeeCollectionDetailView = CollectionDetailView.extend(function EmployeeCollectionDetailView() {
    CollectionDetailView.apply(this, arguments);

    var name = this.model.get('name'), // employeeId not provided, for now
        revenueOverTimeModel = new RevenueOverTimeModel({employeeName: name}),
        revenueByCategoryModel = new RevenueByCategoryModel({employeeName: name});
    this.mapChildView({
      '.overview': {
        TView: DetailMetricsView
      },
      '.revenue-by-category': {
        TView: SmallRevenueByEmployeeView,
        model: revenueByCategoryModel
      },
      '.bar-chart .inner': {
        TView: SmallRevenueOverTimeBarView,
        model: revenueOverTimeModel
      },
      '.bar-chart-full': {
        TView: RevenueOverTimeBarView,
        model: revenueOverTimeModel
      },
      '.metrics': {
        TView: DetailMetricsPanelView
      },
      '.pie-chart-full': {
        TView: DetailCategoriesPanelView,
        model: revenueByCategoryModel
      }
    });
  });

  return EmployeeCollectionDetailView;

});