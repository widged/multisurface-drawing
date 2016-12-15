/* jshint esnext: true */

import Anchor from '../../anchors/Anchor.es6';
import Commands from '../../anchors/CommandTypes';

const {CLOSEPATH, CUBCURVETO, MOVETO, LINETO, ARCTO, QUADCURVETO, rHLINETO, rVLINETO} = Commands;


export default (props) => {
  const {x, y, w, h} = props;
  var anchors = [
    new Anchor(MOVETO, +x, +y),
    new Anchor(rHLINETO, +w),
    new Anchor(rVLINETO, +h),
    new Anchor(rHLINETO, -h),
    new Anchor(CLOSEPATH)
  ];
  return {anchors, endPoint: [+x,+y]};
};
