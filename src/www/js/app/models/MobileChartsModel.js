define(function(require) {
  var Model = require('lavaca/mvc/Model'),
      revenueByCategoryCollection = require('app/models/RevenueByCategoryCollection'),
      revenueByItemCollection = require('app/models/RevenueByItemCollection'),
      employeeCollection = require('app/models/EmployeeCollection'),
      debounce = require('mout/function/debounce');

  var MobileChartsModel = Model.extend(function MobileChartsModel() {
    Model.apply(this, arguments);
    this.apply({
      categories: _categories,
      items: _items,
      employees: _employees
    });

    this._externalBoundHandler = debounce(_onDataChange.bind(this), 0);
    [revenueByCategoryCollection, revenueByItemCollection, employeeCollection].forEach(function(collection) {
      collection.on('addItem', this._externalBoundHandler);
      collection.on('removeItem', this._externalBoundHandler);
      collection.on('dataChange', this._externalBoundHandler);
    }.bind(this));
  }, {
    dispose: function() {
      [revenueByCategoryCollection, revenueByItemCollection, employeeCollection].forEach(function(collection) {
        collection.off('addItem', this._externalBoundHandler);
        collection.off('removeItem', this._externalBoundHandler);
        collection.off('dataChange', this._externalBoundHandler);
      });
      return Model.dispose.apply(this, arguments);
    }
  });
  // Event handlers
  function _onDataChange() {
    this.trigger('dataChange');
  }

  // Computed properties
  function _categories() {
    var items = revenueByCategoryCollection.toObject().items,
        total = 0;

    // Sort and trim
    items.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    items = items.slice(0, 6);

    // Calculate total
    items.forEach(function(item) {
      total += item.total;
    });

    // Add percent attribute
    items.forEach(function(item) {
      item.percent = item.total / total;
    });
    return items;
  }
  function _items() {
    var items = revenueByItemCollection.toObject().items;
    items.sort(function(a, b) {
      return b.total - a.total;
    });
    items = items.slice(0, 6);
    return items;
  }
  function _employees() {
    var items = employeeCollection.toObject().items;
    items.sort(function(a, b) {
      return b.total - a.total;
    });
    items = items.slice(0, 6);
    return items;
  }

  return new MobileChartsModel();
});