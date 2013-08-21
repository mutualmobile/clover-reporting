define(function(require) {

  var RevenueByEmployeeView = require('./RevenueByEmployeeView');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.FilteredRevenueByEmployeeView
   * @extends app.ui.views.RevenueByEmployeeView
   */
  var FilteredRevenueByEmployeeView = RevenueByEmployeeView.extend(function FilteredRevenueByEmployeeView() {
    RevenueByEmployeeView.apply(this, arguments);
  }, {
    getData: function() {
      var data = [];
      this.model.each(function(index, model) {
        var name = model.get('name'),
            spaceIndex = name.indexOf(' ');
        if (spaceIndex > -1 && spaceIndex < name.length - 1) {
          name = name.substr(0, spaceIndex+2);
        }
        data.push({
          label: name,
          value: model.get('total')
        });
      });

      data.sort(function(a, b) {
        return b.label.localeCompare(a.label);
      });

      if (data.length) {
        return data;
      } else {
        return null;
      }
    }
  });

  return FilteredRevenueByEmployeeView;

});