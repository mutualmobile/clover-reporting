define(function() {

  return function(handle, orderType) {
    if (orderType) {
      handle.filter(function(order, orderType) {
        return order.orderType === orderType;
      }, orderType);
    }
  };
});