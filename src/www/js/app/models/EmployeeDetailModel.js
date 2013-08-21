define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var EmployeeDetailModel = Model.extend(function EmployeeDetailModel() {
    Model.apply(this, arguments);
    this.apply({
      'firstName': _firstName,
      'lastName': _lastName,
      'pieDetailList': _pieDetailList,
      'barChartLabel': 'Employee Sales',
      'averageOrder': _averageOrder
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

  function _averageOrder() {
    var count = this.get('count');
    if (count) {
      return this.get('total') / count;
    }
  }

  return EmployeeDetailModel;
});