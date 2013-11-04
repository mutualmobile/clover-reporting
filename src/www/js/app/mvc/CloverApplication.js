define(function(require) {
  var Application = require('lavaca/mvc/Application'),
      History = require('lavaca/net/History'),
      $ = require('$');

  var CloverApplication = Application.extend(function CloverApplication() {
    Application.apply(this, arguments);
  }, {
    // Override default link handling behavior
    onTapLink: function(e) {
      var link = $(e.currentTarget),
          defaultPrevented = e.isDefaultPrevented(),
          url = link.attr('href') || link.attr('data-href'),
          rel = link.attr('rel'),
          target = link.attr('target'),
          isExternal = link.is('[data-external]') || _isExternal(url);

      if (!defaultPrevented) {
        if (target === '_blank' || isExternal) {
          return true;
        } else {
          e.preventDefault();
          if (rel === 'back') {
            History.back();
          } else if (rel === 'cancel') {
            this.viewManager.dismiss(e.currentTarget);
          } else if (url) {
            url = url.replace(/^\/?#/, '');
            this.router.exec(url).error(this.onInvalidRoute);
          }
        }
      }
    }
  });

  // http://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls
  function _isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === 'string' && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === 'string' && match[2].length > 0 && match[2].replace(new RegExp(':('+{'http:':80,'https:':443}[location.protocol]+')?$'), '') !== location.host) return true;
    return false;
  }

  return CloverApplication;
});