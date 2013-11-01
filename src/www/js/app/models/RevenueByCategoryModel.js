define(function(require) {
  var BasePieChartModel = require('app/models/BasePieChartModel'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem'); // Will be exposed globally in worker

  var RevenueByCategoryModel = BasePieChartModel.extend(function RevenueByCategoryModel() {
    BasePieChartModel.apply(this, arguments);
  }, {
    setDataOperations: function() {
      this
        .map(function(data) {
          var lineItems = data.lineItems,
              result = {};
          if (lineItems && lineItems.length) {
            lineItems.forEach(function(lineItem) {
              var categories = (lineItem.item && lineItem.item.categories) || [];
              categories.forEach(function(category) {
                var name = category.name;
                result[name] = (result[name] || 0) + revenueForLineItem(lineItem);
              });
            });
          }
          return result;
        })
        .reduce(function(prev, current) {
          var counts = prev[0];
          for (var name in current) {
            counts[name] = (counts[name] || 0) + current[name];
          }
          return prev;
        }, [{}])
        .reduce(function(prev, current) {
          for (var name in current) {
            prev.push({
              label: name,
              value: current[name]
            });
          }
          return prev;
        }, [])
        .sort(function(a, b) {
          return a.label.localeCompare(b.label);
        });
    }
  });

  return RevenueByCategoryModel;
});