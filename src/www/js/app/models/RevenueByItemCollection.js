define(function(require) {
  var CustomService = require('app/data/CustomService'),
      colors = require('app/misc/color_scheme'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection');

  var RevenueByItemCollection = BaseChartDataCollection.extend(function RevenueByItemCollection() {
    BaseChartDataCollection.apply(this, arguments);
    this.set('popoverData', _popoverData);
  }, {
    fetch: function() {
      return CustomService.getRevenueByItemForDateRange.apply(CustomService, arguments);
    }
  });

  function _popoverData() {
    var data = {
          title: 'Top Drinks',
          items: []
        };

    this.each(function(index, model) {
      data.items.push({
        label: model.get('name'),
        value: model.get('total')
      });
    });

    // Sort and limit items
    data.items.sort(function(a, b) {
      return b.value - a.value;
    });
    data.items = data.items.slice(0, colors.length);

    // Add 'percentOfTop' and 'color' attributes
    data.items.forEach(function(item, index) {
      item.color = colors[index];
      item.percentOfTop = (item.value / data.items[0].value) * 100;
    });

    return data;
  }

  return new RevenueByItemCollection();
});