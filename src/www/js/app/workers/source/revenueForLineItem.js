define(function() {
  return function revenueForLineItem(lineItem) {
    var revenue = (lineItem.price * lineItem.qty) + lineItem.discountAmount;
    if (lineItem.taxable) {
      revenue += Math.round((lineItem.price * lineItem.qty) * (lineItem.taxRate / 10000000));
    }
    if (lineItem.refunded) {
      revenue = 0;
    }
    return revenue;
  };
});