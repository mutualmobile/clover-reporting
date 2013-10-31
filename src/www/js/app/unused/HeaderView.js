define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      TimeSelectorView = require('app/ui/navigation/TimeSelectorView'),
      timeRangeModel = require('app/models/global/TimeRangeModel'),
      stateModel = require('app/models/global/StateModel');
  require('rdust!templates/header');

  /**
   * Header view type
   * @class app.ui.views.globalUI.HeaderView
   * @super app.ui.BaseView
   */
  var HeaderView = BaseView.extend(function(){
      BaseView.apply(this, arguments);

      this.mapEvent({
        model: {
          change: this.onModelChange.bind(this)
        }
      });
      this.mapChildView({
        '.time-selector': {
          TView: TimeSelectorView,
          model: timeRangeModel
        }
      });
    }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'templates/header'
     */
    template: 'templates/header',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'header'
     */
    className: 'header',

    onModelChange: function() {
      this.redraw('.title');
    }
  });

  return new HeaderView('#nav-header', stateModel);
});