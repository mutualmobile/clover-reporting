define(function(require) {

  var Config = require('lavaca/util/Config');

  // ----------- Google Analytics snippet ---------
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  // --------- End Google Analytics snippet -------

  var ga = window.ga;
  ga('create', Config.get('analytics_ua') || '', 'auto');

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
    }
  };

  // Utility functions

  function _send(obj, cb) {
    if (cb) {
      obj.hitCallback = cb;
    }
    ga('send', obj);
  }


  return tracker;
});