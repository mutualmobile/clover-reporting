define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      mixIn = require('mout/object/mixIn'),
      clone = require('mout/lang/clone'),
      remove = require('mout/array/remove'),
      hash = require('app/misc/hash'),
      dataOperationMixin = require('app/models/data/dataOperationMixin');

  var BaseDataCollection = Collection.extend(function BaseDataCollection() {
    Collection.apply(this, arguments);
    this.setupDataHandling();
  }, mixIn(dataOperationMixin(Collection), {
    onDataChange: function(data) {
      var newHash = hash(JSON.stringify(data));
      if (newHash !== this._lastDataHash) {
        _applyData.call(this, data);
        this._lastDataHash = newHash;
      }
    }
  }));

  // Private instance methods

  // Performs a diff of the new data and the
  // current models, matching items based on
  // the 'id' attribute. Performs any necessary
  // add, move, change, and remove operations
  // in order to make the current models match
  // the new data
  function _applyData(data) {
    var models;
    if (!data || !data.length || !data[0].id) {
      this.clearModels();
      this.add(data);
    } else {
      models = clone(this.models);

      // Update existing items and
      // add new items
      data.forEach(function(item) {
        var current;
        if (item.id) {
          current = this.first({id: item.id});
          if (current) {
            current.apply(item);
            remove(models, current);
          } else {
            this.add(item);
          }
        }
      }.bind(this));

      // Remove old items
      models.forEach(function(model) {
        this.remove(model);
      }.bind(this));

      // Re-arrange
      data.forEach(function(item, index) {
        var match = this.first({id: item.id}),
            currentIndex;
        if (match) {
          currentIndex = this.models.indexOf(match);
          if (currentIndex !== index) {
            this.moveTo(currentIndex, index);
          }
        }
      }.bind(this));
    }
  }

  // Utility functions

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