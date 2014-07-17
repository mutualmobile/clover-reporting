define(function(require) {
  var Disposable = require('lavaca/util/Disposable'),
      DataHandle = require('app/data/DataHandle'),
      stateModel = require('app/models/global/StateModel'),
      Config = require('lavaca/util/Config'),
      StringUtils = require('lavaca/util/StringUtils'),
      localStore = require('app/cache/localStore'),
      timeRangeModel = require('app/models/global/TimeRangeModel'),
      encodeQueryString = require('mout/queryString/encode'),
      Worker = require('app/workers/Worker');

  var DataHub = Disposable.extend(function DataHub() {
    Disposable.apply(this, arguments);
    this._worker = new Worker();

    // Set initial URL and listen for updates
    _setURL.call(this);
    stateModel.on('change', 'loggedIn', _onChangeLoggedIn.bind(this));

    // Listen for updates to the loading state and update stateModel
    _listenForStatusChanges.call(this);

    // Set initial time range and listen for updates
    _onRangeUpdate.call(this);
    timeRangeModel.on('rangeUpdate', _onRangeUpdate.bind(this));
  }, {
    clear: function() {
      this._worker.send('clear');
    },
    createDataHandle: function() {
      return new DataHandle(this._worker);
    }
  });

  // Private functions

  function _setURL() {
    var baseURL = Config.get('api_url'),
        merchantId,
        accessToken,
        params,
        url;
    if (stateModel.get('loggedIn')) {
      merchantId = 'current';
      accessToken = localStore.get('accessToken');
      params = {
        'access_token': accessToken,
        'expand': 'line_items,items'
      };
      url = StringUtils.format(baseURL, merchantId, 'orders' + encodeQueryString(params));
      this._worker.send('setURL', url);
    }
  }

  function _listenForStatusChanges() {
    this._worker.addMessageHandler(function(e) {
      var data = e.data;
      if (data.type === 'status') {
        stateModel.set('dataStatus', data.status);
      }
    });
  }

  // Event handlers

  function _onRangeUpdate() {
    var startTime = timeRangeModel.get('startTime').valueOf(),
        endTime = timeRangeModel.get('endTime').valueOf();
    this._worker.send('setTimeRange', {
      startTime: startTime,
      endTime: endTime
    });
  }

  function _onChangeLoggedIn(e) {
    if (e.value) {
      _setURL.call(this);
    } else {
      this.clear();
    }
  }

  return new DataHub();
});