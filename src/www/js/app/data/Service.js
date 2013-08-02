define(function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      Config = require('lavaca/util/Config'),
      Promise = require('lavaca/util/Promise'),
      Connectivity = require('lavaca/net/Connectivity'),
      $ = require('jquery'),
      StringUtils = require('lavaca/util/StringUtils');

  /**
   * Base service class used for interacting with REST services.
   * @class app.data.Service
   * @extends Lavaca.util.Disposable
   */
  var Service = Disposable.extend(function Service() {
    Disposable.apply(this);
  }, {
    /**
     * The key key that will be used to load the API URL
     * from the Config object.
     * @property apiURLKey
     * @default 'api_url'
     *
     * @type String
     */
    apiURLKey: 'api_url',
    /**
     * The key that will be used to load the mock URL
     * from the Config object.
     * @property mockURLKey
     * @default 'mock_url'
     *
     * @type String
     */
    mockURLKey: 'mock_url',
    /**
     * The key that will be used to load the artificial delay value
     * (in milliseconds) from the Config object. Artificial network
     * delays will only be applied to mock requests and are
     * intended to simulate latency.
     * @property artificialDelayKey
     * @default 'artificial_network_delay'
     *
     * @type String
     */
    artificialDelayKey: 'artificial_network_delay',
    /**
     * Makes a service request and returns a promise that will be
     * resolved with the data if the request succeeds.
     * @method makeRequest
     *
     * @param {String} endpoint  The value to substitute into the url string
     * @param {Object} params  A hash of data to send along with the request
     * @param {String} type  (Optional) Type of request (GET, POST, etc). Defaults to GET.
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Makes a service request and returns a promise that will be
     * resolved with the data if the request succeeds. To use mock
     * data, pass true for the first parameter.
     * @method makeRequest
     *
     * @param {Boolean} useMock  True if the mock url should be used
     * @param {String} endpoint  The value to substitute into the url string
     * @param {Object} params  A hash of data to send along with the request
     * @param {String} type  (Optional) Type of request (GET, POST, etc). Defaults to GET.
     * @return {Lavaca.util.Promise}  A promise
     */
    makeRequest: function(useMock, endpoint, params, type) {
      var promise = new Promise(),
          artificialDelay = Config.get(this.artificialDelayKey),
          data,
          url;

      if (typeof useMock !== 'boolean') {
        type = params;
        params = endpoint;
        endpoint = useMock;
        useMock = false;
      }

      params = params || {};

      url = StringUtils.format(Config.get(useMock ? this.mockURLKey : this.apiURLKey), endpoint);
      type = useMock ? 'GET' : type || 'GET';

      if (type === 'GET') {
        data = params;
      } else {
        data = JSON.stringify(params);
      }

      if (Connectivity.isOffline()) {
        return promise.reject();
      }

      var ajax = $.ajax({
        url: url,
        dataType: 'json',
        type: type,
        data: data,
        contentType: 'application/json',
        dataFilter: function(data, type) {
          // An empty string is technically invalid JSON
          // so jQuery will fail to parse it and our promise
          // will get rejected unless we first convert
          // it to valid JSON
          if (data === '' && type === 'json') {
            return 'null';
          }
          return data;
        },
        success: function(response, status) {
          if (status === 'success') {
            if (useMock && artificialDelay) {
              setTimeout(function() {
                promise.resolve(response);
              }, artificialDelay);
            } else {
              promise.resolve(response);
            }
          } else {
            promise.reject(response);
          }
        },
        error: function() {
          var args = Array.prototype.slice.call(arguments, 0);
          if (useMock && artificialDelay) {
            setTimeout(function() {
              promise.reject.apply(promise, args);
            }, artificialDelay);
          } else {
            promise.reject.apply(promise, args);
          }
        }
      });

      // If the promise is rejected, abort the ajax
      // request. This allows for manually aborting
      // the ajax request from elsewhere in code just
      // by rejecting the promise. Calling .abort() after
      // the ajax request has already returned should
      // be harmless.
      promise.error(function() {
        ajax.abort();
      });

      return promise;
    }
  });

  return Service;
});