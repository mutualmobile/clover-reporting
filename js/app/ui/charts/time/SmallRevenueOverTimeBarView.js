define(function(require) {
  var RevenueOverTimeBarView = require('app/ui/charts/time/RevenueOverTimeBarView'),
      nv = require('nv');

  var SmallRevenueOverTimeBarView = RevenueOverTimeBarView.extend(function SmallRevenueOverTimeBarView() {
    RevenueOverTimeBarView.apply(this, arguments);
  }, {
    createChart: function() {
      var chart = nv.models.discreteBarChart()
                    .x(function(d) { return d.label; })
                    .y(function(d) { return d.value; })
                    .tooltips(false)
                    .showValues(false)
                    .showXAxis(false)
                    .margin({top: 23, left: 20, right: 20, bottom: 5})
                    .showYAxis(false)
                    .color(function() {
                      return '#1ae08e';
                    })
                    .width(133)
                    .height(77);
      return chart;
    }
  });

  return SmallRevenueOverTimeBarView;
});