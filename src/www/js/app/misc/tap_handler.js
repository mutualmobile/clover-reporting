define(function(require) {
  var $ = require('$');

  var _TOUCH_CLASS = 'touch',
      _TOUCH_DELAY = 0,
      _MOVE_THRESHOLD = 10,
      _UNDEFINED;

  var _supportsTouchEvents = false;
  (function() {
    var el = document.createElement('div');
    el.setAttribute('ontouchstart', 'return;');
    _supportsTouchEvents = typeof el.ontouchstart === 'function';
  })();

  $.event.special.tap = {
    add: function(handle) {
      var $el = $(this),
          delegate = handle.selector,
          callback = handle.handler;

      var startX, startY, moved, touchTimer;
      if (_supportsTouchEvents) {
        $el.on('touchstart', delegate, function(e) {
          startX = e.originalEvent.touches[0].clientX;
          startY = e.originalEvent.touches[0].clientY;
          moved = false;
          touchTimer = setTimeout(function() {
            $(this).addClass(_TOUCH_CLASS);
          }.bind(this), _TOUCH_DELAY);
        });
        $el.on('touchmove', delegate, function(e) {
          var x = e.originalEvent.touches[0].clientX,
              y = e.originalEvent.touches[0].clientY;
          if (Math.abs(x - startX) > _MOVE_THRESHOLD || Math.abs(y - startY) > _MOVE_THRESHOLD) {
            moved = true;
            window.clearTimeout(touchTimer);
            $(this).removeClass(_TOUCH_CLASS);
          }
        });
        $el.on('touchend', delegate, function() {
          var $el = $(this);
          if (!moved && callback) {
            callback.apply(this, arguments);
          }
          window.clearTimeout(touchTimer);
          if ($el.attr('data-persist-touch') === _UNDEFINED) {
            $el.removeClass(_TOUCH_CLASS);
          }
        });
        $el.on('touchcancel', delegate, function() {
          window.clearTimeout(touchTimer);
          $(this).removeClass(_TOUCH_CLASS);
        });
        if (callback) {
          $el.on('click', delegate, function(e) {
            e.preventDefault();
          });
        }
      } else if (callback) {
        $el.on('click', delegate, function() { callback.apply(this, arguments); });
      }
    }
  };
});