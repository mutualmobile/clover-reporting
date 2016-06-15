define(function() {
  // Returns the total for a lineItem. This function
  // is exposed globally in the web worker context.
  return function revenueForLineItem(lineItem) {
    if (lineItem.item) {
      if (lineItem.item.priceType === "PER_UNIT") {
        var quantity = lineItem.qty / 1000;
      } else {
        var quantity = lineItem.qty;
      }
    } else {
      var quantity = lineItem.qty;
    }

    var revenue = ((lineItem.price) * quantity) + lineItem.discountAmount;

    if (lineItem.taxable) {
      revenue += (revenue * (lineItem.taxRates[0].rate / 10000000));
    }
    if (lineItem.refunded) {
      revenue = 0;
    }

    return revenue;
  };
});