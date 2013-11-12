define(function() {

  return function(handle, employeeName) {
    if (employeeName) {
      handle.filter(function(order, employeeName) {
        return order.employeeName === employeeName;
      }, employeeName);
    }
  };
});