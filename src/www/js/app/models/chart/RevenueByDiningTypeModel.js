define(function(require) {
  var BasePieChartModel = require('app/models/chart/BasePieChartModel'),
      filterByDiningType = require('app/data/operations/filterByDiningType');

  var RevenueByDiningTypeModel = BasePieChartModel.extend(function RevenueByDiningTypeModel() {
    BasePieChartModel.apply(this, arguments);
    this.apply({
      popoverTitle: 'Top Dining Types',
      pieDetailList: _pieDetailList
    });
    this.addDataOperation(_dataOperation);
  });

  // Private functions

  function _dataOperation(handle) {
    // Filter if necessary
    filterByDiningType(handle, this.get('itemId'));
    handle
      .map(function(order) {
        console.log(order.orderType)
        var orderType = order.orderType,
            result = {};
        if (orderType) {
          result[orderType] = order.total;
        }
        return result;
      });
    this.applyStandardFormatting(handle);
  }

  // Computed properties

  function _pieDetailList() {
    return this.get('data').slice(0).sort(function(a, b) {
      return b.value - a.value;
    });
  }

  return RevenueByDiningTypeModel;
});