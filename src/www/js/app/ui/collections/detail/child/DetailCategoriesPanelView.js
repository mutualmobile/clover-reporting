define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView'),
      RevenueByEmployeeView = require('app/ui/charts/pie/RevenueByEmployeeView');
  require('rdust!templates/detail_categories');

  var DetailCategoriesPanelView = BaseDataView.extend(function DetailCategoriesPanelView() {
    BaseDataView.apply(this, arguments);
    this.mapChildView({
      '.pie-detail': {
        TView: RevenueByEmployeeView
      }
    });
  }, {
    template: 'templates/detail_categories',
    onDataChange: function() {
      BaseDataView.prototype.onDataChange.apply(this, arguments);
      this.redraw('ol.list');
    }
  });

  return DetailCategoriesPanelView;
});