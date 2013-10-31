define(function(require) {
  var BaseDataModel = require('app/models/BaseDataModel'),
      colors = require('app/misc/color_scheme'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem'); // Will be exposed globally in worker

  var RevenueByItemModel = BaseDataModel.extend(function RevenueByItemModel() {
    BaseDataModel.apply(this, arguments);
    this.set('popoverData', _popoverData);
  }, {
    setDataOperations: function() {
      this
        .map(function(data) {
          var lineItems = data.lineItems,
              result = {};
          if (lineItems && lineItems.length) {
            lineItems.forEach(function(lineItem) {
              var name = lineItem.name;
              if (name) {
                result[name] = (result[name] || 0) + revenueForLineItem(lineItem);
              }
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
          return b.value - a.value;
        });
    }
  });

  function _popoverData() {
    var popoverData = {
          title: 'Top Items',
          items: []
        },
        data = this.get('data');

    data.forEach(function(item) {
      popoverData.items.push({
        label: item.label,
        value: item.value
      });
    });

    // Sort and limit items
    popoverData.items.sort(function(a, b) {
      return b.value - a.value;
    });
    popoverData.items = popoverData.items.slice(0, colors.length);

    // Add 'percentOfTop' and 'color' attributes
    popoverData.items.forEach(function(item, index) {
      item.color = colors[index];
      item.percentOfTop = (item.value / popoverData.items[0].value) * 100;
    });

    return popoverData;
  }

  return RevenueByItemModel;
});