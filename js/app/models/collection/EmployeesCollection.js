define(function (require) {
  var DetailCollection = require('app/models/collection/DetailCollection'),
      sumByEmployee = require('app/data/operations/sumByEmployee');

  var EmployeesCollection = DetailCollection.extend(function EmployeesCollection() {
    DetailCollection.apply(this, arguments);
  }, {
    sumOperation: sumByEmployee
  });

  return EmployeesCollection;
});