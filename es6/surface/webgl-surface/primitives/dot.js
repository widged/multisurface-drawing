/* jshint esnext: true */

import BoundingBox from '../../canvas-surface/primitives/BoundingBox';

const dot = (props) => {
	var {cx,cy,r} = props;
	var bb = new BoundingBox(cx - r, cy - r, cx + r, cy + r);
	var cmds = [
		['beginPath'],
		['drawCircle', [cx, cy, r]],
		['closePath']
	];
	return {bb, cmds};
};

export default dot;
