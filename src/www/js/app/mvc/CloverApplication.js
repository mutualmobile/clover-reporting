define(function(require) {
  var Application = require('lavaca/mvc/Application'),
      $ = require('$');

  var CloverApplication = Application.extend(function CloverApplication() {
    Application.apply(this, arguments);
  }, {
    bindLinkHandler: function() {
      var $body = $(document.body),
          type = 'click';
      if ($body.hammer) {
        $body = $body.hammer();
        type = 'tap';
        $body.on('click', 'a', _stopEvent);
      }
      $body
        .on(type, '[href], [data-href]', this.onTapLink.bind(this));
    }
  });

  function _stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return CloverApplication;
});