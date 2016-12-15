/* jshint esnext: true */

import Anchor from '../../anchors/Anchor.es6';
import Commands from '../../anchors/CommandTypes';

const {CLOSEPATH, MOVETO, LINETO, QUADCURVETO} = Commands;

export default (props) => {
  var {s, e, c1, c2, m} = props;
  var anchors = [
    new Anchor(MOVETO,0,0),
    new Anchor(LINETO, s.x, s.y),
    new Anchor(QUADCURVETO, c1.x, c1.y, m.x, m.y),
    new Anchor(LINETO, m.x, m.y),
    new Anchor(QUADCURVETO, c2.x, c2.y, e.x, e.y),
    new Anchor(CLOSEPATH),
  ];
  return anchors;
};
