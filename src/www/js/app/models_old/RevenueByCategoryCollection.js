define(function(require) {
  var CustomService = require('app/service/CustomService'),
      revenueByItemCollection = require('app/models_old/RevenueByItemCollection'),
      colors = require('app/misc/color_scheme'),
      BaseChartDataCollection = require('app/models_old/BaseChartDataCollection');

  var RevenueByCategoryCollection = BaseChartDataCollection.extend(function RevenueByCategoryCollection() {
    BaseChartDataCollection.apply(this, arguments);
    this.apply({
      'popoverData': revenueByItemCollection,
      'legend': _legend
    });
  }, {
    fetch: function() {
      return CustomService.getRevenueByCategoryForDateRange.apply(CustomService, arguments);
    }
  });

  // Computed properties
  function _legend() {
    var data = [];

    this.each(function(index, model) {
      data.push({
        name: model.get('name'),
        total: model.get('total')
      });
    });

    data.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    data.forEach(function(item, index) {
      item.color = colors[index % colors.length];
    });

    return data;
  }

  return new RevenueByCategoryCollection();
});