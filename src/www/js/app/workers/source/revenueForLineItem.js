define(function() {
  // Returns the total for a lineItem. This function
  // is exposed globally in the web worker context.
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