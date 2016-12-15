/* jshint esnext: true */

import rect from './rect';

const dotsquare = (props) => {
  const {cx, cy, r} = props;
  const size = r * 2;
  return rect({ x : cx - r, y : cy - r, width : size, height : size });
};

export default dotsquare;
