define(function(require) {
  var Model = require('lavaca/mvc/Model');


  var _HOUR = 1000 * 60 * 60,
      _MIN_DURATION = 1000 * 60 * 10;

  var EmployeeDetailModel = Model.extend(function EmployeeDetailModel() {
    Model.apply(this, arguments);
    this.apply({
      'firstName': _firstName,
      'lastName': _lastName,
      'pieDetailList': _pieDetailList,
      'drinksPerOrder': _drinksPerOrder,
      'salesPerHour': _salesPerHour,
      'drinksPerHour': _drinksPerHour,
      'barChartLabel': 'Employee Sales'
    });
  }, {
    filterCollectionItem: function(index, model) {
      return model.get('employeeName') === this.get('name');
    }
  });

  // Computed Properties
  function _firstName() {
    var fullName = this.get('name'),
        spaceIndex;
    if (fullName) {
      spaceIndex = fullName.indexOf(' ');
      return spaceIndex > -1 ? fullName.substr(0, spaceIndex) : fullName;
    }
    return null;
  }
  function _lastName() {
    var fullName = this.get('name'),
        spaceIndex;
    if (fullName) {
      spaceIndex = fullName.indexOf(' ');
      return spaceIndex > -1 ? fullName.substr(spaceIndex+1) : '';
    }
    return null;
  }

  function _pieDetailList() {
    return this.get('revenueByItem');
  }

  function _drinksPerOrder() {
    var orderCount = this.get('orderCount');
    if (orderCount) {
      return (this.get('count') / orderCount).toFixed(2);
    }
  }

  function _salesPerHour() {
    var firstOrder = this.get('firstOrder'),
        lastOrder = this.get('lastOrder'),
        total = this.get('total');

    if (firstOrder && lastOrder && (lastOrder - firstOrder) > _MIN_DURATION) {
      return total / ((lastOrder - firstOrder) / _HOUR);
    }
    return -1;
  }

  function _drinksPerHour() {
    var firstOrder = this.get('firstOrder'),
        lastOrder = this.get('lastOrder'),
        count = this.get('count');

    if (firstOrder && lastOrder && count) {
      return (count / ((lastOrder - firstOrder) / _HOUR)).toFixed(2);
    }
    return -1;
  }

  return EmployeeDetailModel;
});