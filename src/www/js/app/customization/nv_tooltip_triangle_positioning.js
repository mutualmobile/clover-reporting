define(function(require) {
  var nv = require('nv'),
      $ = require('$');

  var _MIN_TRIANGLE_INSET = 5;

  var origFunc = nv.tooltip.calcTooltipPosition;

  nv.tooltip.calcTooltipPosition = function(pos, gravity, dist, container) {
    var markerX = pos[0],
        offset = 0,
        $container,
        $triangle,
        containerLeft,
        containerWidth,
        triangleLeft,
        triangleWidth,
        triangleHalfWidth;
    origFunc.apply(this, arguments);
    $container = $(container);
    $triangle = $container.find('.triangle');
    if ($triangle.length) {
      containerLeft = $container.position().left;
      containerWidth = $container.outerWidth();
      triangleWidth = $triangle.outerWidth();
      triangleHalfWidth = triangleWidth / 2;
      triangleLeft = markerX - containerLeft;
      if (triangleLeft + triangleHalfWidth + _MIN_TRIANGLE_INSET > containerWidth) { // overhangs on the right
        offset = triangleLeft + triangleHalfWidth + _MIN_TRIANGLE_INSET - containerWidth;
        $container.css('left', containerLeft + offset);
      } else if (triangleLeft - (triangleHalfWidth + _MIN_TRIANGLE_INSET) < 0) { // overhangs on the left
        offset = - (triangleLeft - (triangleHalfWidth + _MIN_TRIANGLE_INSET));
        $container.css('left', containerLeft + offset);
      }
      triangleLeft -= offset;
      $triangle.css('left', triangleLeft + 'px');
    }
  };
});