/* jshint esnext: true */

var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3); // 0.5522848

const drawEllipse = (props) => {
  var {cx,cy,rx,ry} = props;

  var bb = new BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
  const ox = (KAPPA * rx), // control point offset horizontal
        oy = (KAPPA * ry); // control point offset vertical

  var cmds = [
    ['beginPath'],
    ['moveTo', [cx, cy - ry]],
    ['bezierCurveTo', [cx + ox, cy - ry,  cx + rx, cy - oy, cx + rx, cy]],
    ['bezierCurveTo', [cx + rx, cy + oy, cx + ox, cy + ry, cx, cy + ry]],
    ['bezierCurveTo', [cx - ox, cy + ry, cx - rx, cy + oy, cx - rx, cy]],
    ['bezierCurveTo', [cx - rx, cy - oy, cx - ox, cy - ry, cx, cy - ry]],
    ['closePath']
  ];
  return {bb, cmds};
};
