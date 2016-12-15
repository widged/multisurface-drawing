/* jshint esnext: true */

import Anchor from '../../anchors/Anchor.es6';
import Commands from '../../anchors/CommandTypes';

const {CLOSEPATH, CUBCURVETO, MOVETO, LINETO, ARCTO, QUADCURVETO, rHLINETO, rVLINETO} = Commands;

export default (props) => {
  var {lines} = props;
  var anchors = [];

  anchors.push(new Anchor(MOVETO, ...lines[0]));
  for(let i = 1, ni = lines.length; i < ni; i += 1) {
    anchors.push(new Anchor(LINETO, ...lines[i]));
  }
  anchors.push(new Anchor(CLOSEPATH));
  return anchors;
};
