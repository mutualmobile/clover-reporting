define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      mixIn = require('mout/object/mixIn'),
      dataOperationMixin = require('app/models/data/dataOperationMixin');

  var BaseDataCollection = Collection.extend(function BaseDataCollection() {
    Collection.apply(this, arguments);
    this.setupDataHandling();
  }, mixIn(dataOperationMixin(Collection), {
    onDataChange: function(data) {
      var prev = this.get('data');
      if (!arraysEqual(prev, data)) {
        this.set('data', data);
      }
    }
  }));

  function arraysEqual(a, b) {
    if (a === b) { return true; }
    if (a.length !== b.length) { return false; }

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  return BaseDataCollection;
});