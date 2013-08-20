define(function(require) {

  var RevenueByEmployeeView = require('./RevenueByEmployeeView');

  /**
   * Renders a pie chart showing revenue
   * breakdown by category
   * @class app.ui.views.SmallRevenueByEmployeeView
   * @extends app.ui.views.RevenueByEmployeeView
   */
  var SmallRevenueByEmployeeView = RevenueByEmployeeView.extend(function SmallRevenueByEmployeeView() {
    RevenueByEmployeeView.apply(this, arguments);
  }, {
    getData: function() {
      var data = [];
      this.model.each(function(index, model) {
        data.push({
          label: model.get('name'),
          value: model.get('total') / 100
        });
      });

      if (data.length) {
        return data;
      } else {
        return null;
      }
    },
    createChart: function() {
      var chart = RevenueByEmployeeView.prototype.createChart.apply(this, arguments);
      chart
        .arcRadius(28)
        .showLabels(false);
      return chart;
    }
  });

  return SmallRevenueByEmployeeView;

});