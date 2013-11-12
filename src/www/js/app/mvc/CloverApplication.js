define(function(require) {
  var Application = require('lavaca/mvc/Application'),
      $ = require('$');

  var CloverApplication = Application.extend(function CloverApplication() {
    Application.apply(this, arguments);
  }, {
    onTapLink: function(e) {
      var link = $(e.currentTarget),
          defaultPrevented = e.isDefaultPrevented(),
          url = link.attr('href') || link.attr('data-href'),
          isExternal = link.is('[data-external]') || _isExternal(url);

      if (!defaultPrevented) {
        if (isExternal) {
          location.href = url;
        } else {
          e.preventDefault();
          if (url) {
            url = url.replace(/^\/?#/, '');
            this.router.exec(url);
          }
        }
      }
    }
  });

  function _isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === 'string'
        && match[1].length > 0
        && match[1].toLowerCase() !== location.protocol) {
      return true;
    }
    if (typeof match[2] === 'string'
        && match[2].length > 0
        && match[2].replace(new RegExp(':('+{'http:':80,'https:':443}[location.protocol]+')?$'), '') !== location.host) {
      return true;
    }
    return false;
  }

  return CloverApplication;
});