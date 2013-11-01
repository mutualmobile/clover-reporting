define(function(require) {
  var BaseDataModel = require('app/models/BaseDataModel'),
      colors = require('app/misc/color_scheme');

  var BasePieChartModel = BaseDataModel.extend(function BasePieChartModel() {
    BaseDataModel.apply(this, arguments);
    this.apply({
      legend: _legend,
    });
  }, {
    colors: colors,
    onDataChange: function(data) {
      BaseDataModel.prototype.onDataChange.call(this, data);
      this.set('pieData', this.handleOther(data));
    },
    handleOther: function(data) {
      var total = 0,
          cutoff = 0.062,
          newData = [],
          other = {
            label: 'Other',
            value: 0
          },
          i;

      if (!data) { return data; }

      // Calculate total
      data.forEach(function(item) {
        total += item.value;
      });

      // Find which items fall below the cutoff
      // and add them to 'Other'
      for (i = data.length - 1; i >= 0; i--) {
        if ((data[i].value / total) < cutoff) {
          other.value += data[i].value;
        } else {
          newData.unshift(data[i]);
        }
      }

      // Add 'Other' category if necessary
      if (other.value) {
        newData.push(other);
      }

      return newData;
    }
  });

  // Computed properties
  function _legend() {
    var legend = [],
        data = this.get('pieData') || [],
        colors = this.colors;

    data.forEach(function(item, index) {
      legend.push({
        color: colors[index % colors.length],
        name: item.label
      });
    });

    return legend;
  }

  return BasePieChartModel;
});