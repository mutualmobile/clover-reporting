define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel'),
      colors = require('app/misc/color_scheme');

  var BasePieChartModel = BaseDataModel.extend(function BasePieChartModel() {
    BaseDataModel.apply(this, arguments);
    this.apply({
      legend: _legend,
      popoverData: _popoverData
    });
  }, {
    colors: colors,
    onDataChange: function(data) {
      BaseDataModel.prototype.onDataChange.call(this, data);
      this.set('pieData', this.handleOther(data));
    },
    applyStandardFormatting: function(handle) {
      handle
        .reduce(function(prev, current) {
          var counts = prev[0];
          for (var name in current) {
            if (current[name] > 0) {
              counts[name] = (counts[name] || 0) + current[name];
            }
          }
          return prev;
        }, [{}])
        .reduce(function(prev, current) {
          var label;
          for (var name in current) {
            label = name.length > 15 ? name.substring(0, 12) + '...' : name;
            prev.push({
              label: label,
              value: current[name]
            });
          }
          return prev;
        }, [])
        .sort(function(a, b) {
          return a.label.localeCompare(b.label);
        });
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

  function _popoverData() {
    var popoverData = [],
        data = this.get('data');

    data.forEach(function(item) {
      popoverData.push({
        label: item.label,
        value: item.value
      });
    });

    // Sort and limit items
    popoverData.sort(function(a, b) {
      return b.value - a.value;
    });
    popoverData = popoverData.slice(0, colors.length);

    // Add 'percentOfTop' and 'color' attributes
    popoverData.forEach(function(item, index) {
      item.color = colors[index];
      item.percentOfTop = (item.value / popoverData[0].value) * 100;
    });

    return popoverData;
  }

  return BasePieChartModel;
});