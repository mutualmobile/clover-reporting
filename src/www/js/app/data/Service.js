define(function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      Config = require('lavaca/util/Config'),
      Promise = require('lavaca/util/Promise'),
      Connectivity = require('lavaca/net/Connectivity'),
      hash = require('app/misc/hash'),
      $ = require('jquery'),
      merge = require('mout/object/merge'),
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
    defaultAjaxOptions: {},
    formatURL: function(endpoint, useMock) {
      return StringUtils.format(Config.get(useMock ? this.mockURLKey : this.apiURLKey), endpoint);
    },
    /**
     * Makes a service request and returns a promise that will be
     * resolved with the data if the request succeeds.
     * @method makeRequest
     *
     * @param {Boolean} [useMock]  (Optional) True if the mock url should be used
     * @param {String} endpoint  The value to substitute into the url string
     * @param {Object} [params]  (Optional) A hash of data to send along with the request
     * @param {String} [type]  (Optional) Type of request (GET, POST, etc). Defaults to GET.
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

      url = this.formatURL(endpoint, useMock);
      type = useMock ? 'GET' : type || 'GET';

      if (type === 'GET') {
        data = params;
      } else {
        data = JSON.stringify(params);
      }

      if (Connectivity.isOffline()) {
        return promise.reject();
      }

      var dataHash,
          ajaxOptions = merge({}, this.defaultAjaxOptions, {
            url: url,
            dataType: 'json',
            type: type,
            data: data,
            dataFilter: function(data, type) {
              // An empty string is technically invalid JSON
              // so jQuery will fail to parse it and our promise
              // will get rejected unless we first convert
              // it to valid JSON
              if (data === '' && type === 'json') {
                return 'null';
              }
              dataHash = hash(data);
              return data;
            },
            success: function(response, status) {
              if (status === 'success') {
                if (useMock && artificialDelay) {
                  setTimeout(function() {
                    promise.resolve(response, dataHash);
                  }, artificialDelay);
                } else {
                  promise.resolve(response, dataHash);
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
          }),
          ajax = $.ajax(ajaxOptions);

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