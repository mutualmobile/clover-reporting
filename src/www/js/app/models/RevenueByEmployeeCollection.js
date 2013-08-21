define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      debounce = require('mout/function/debounce'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection');

  var RevenueByEmployeeCollection = Collection.extend(function RevenueByEmployeeCollection() {
    Collection.apply(this, arguments);

    this.set('popoverData', _popoverData);

    this._externalBoundHandler = debounce(_onOrdersChange.bind(this), 0);
    recentOrdersCollection.on('addItem', this._externalBoundHandler);
    recentOrdersCollection.on('removeItem', this._externalBoundHandler);
    recentOrdersCollection.on('dataChange', this._externalBoundHandler);
    this._externalBoundHandler();
  }, {
    dispose: function() {
      recentOrdersCollection.off('addItem', this._externalBoundHandler);
      recentOrdersCollection.off('removeItem', this._externalBoundHandler);
      recentOrdersCollection.off('dataChange', this._externalBoundHandler);
      return Collection.prototype.dispose.apply(this, arguments);
    }
  });

  // Event handlers
  function _onOrdersChange() {
    var totals = {},
        data = [];

    recentOrdersCollection.each(function(index, model) {
      var employeeName = model.get('employeeName');
      if (employeeName) {
        if (!totals[employeeName]) {
          totals[employeeName] = {
            label: employeeName,
            value: 0
          };
        }
        totals[employeeName].value += model.get('total');
      }
    });

    for (var employee in totals) {
      data.push(totals[employee]);
    }

    data.sort(function(a, b) {
      return a.label.localeCompare(b.label);
    });

    this.clearModels();
    this.add(data);
  }

  // Computed Properties
  function _popoverData() {
    var data = {
          title: 'Top Sellers',
          items: []
        },
        colors = ['af4f25', 'b79e16', '2e9a59', '2569af', 'cf1077', '25adaf', '700eaf'];

    this.each(function(index, model) {
      data.items.push(model.toObject());
    });

    data.items.sort(function(a, b) {
      return b.value - a.value;
    });

    data.items = data.items.slice(0, colors.length);
    data.items.forEach(function(item, index) {
      item.color = colors[index];
      item.percentOfTop = (item.value / data.items[0].value) * 100;
    });

    return data;

  }

  return new RevenueByEmployeeCollection();
});