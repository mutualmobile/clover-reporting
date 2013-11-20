define(function(require) {

  var Config = require('lavaca/util/Config'),
      viewManager = require('lavaca/mvc/ViewManager');

  // ----------- Google Analytics snippet ---------
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  // --------- End Google Analytics snippet -------

  var props = location.port === 8080 ? 'auto' : {
    'cookieDomain': 'none'
  };
  window.ga('create', Config.get('analytics_ua') || '', props);

  var tracker = {
    trackPageView: function(url, title, cb) {
      if (url.indexOf('/') !== 0) {
        url = '/' + url;
      }
      _send({
        'hitType': 'pageview',
        'page': url,
        'title': title || document.title
      }, cb);
    },
    trackEvent: function(category, action, label, value) {
      var obj = {
            'hitType': 'event',
            'eventCategory': category,
            'eventAction': action
          },
          cb;
      if (label) {
        obj.eventLabel = label;
      }
      if (value) {
        obj.eventValue = value;
      }
      if (typeof arguments[arguments.length - 1] === 'function') {
        cb = arguments[arguments.length - 1];
      }
      _send(obj, cb);
    },
    setUserDimension: function(dimension, value) {
      window.ga('set', dimension, value);
    },
    getCurrentPageLabel: function() {
      return viewManager.layers[0].trackerLabel;
    }
  };

  // Utility functions

  function _send(obj, cb) {
    if (cb) {
      obj.hitCallback = cb;
    }
    window.ga('send', obj);
  }


  return tracker;
});