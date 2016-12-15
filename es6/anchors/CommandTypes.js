/* jshint esnext: true */

/**
 * A list of commands that dictate how a renderer draw Anchors.
 * A more detailed description of commands can be found on the w3c.
 * https://www.w3.org/TR/SVG2/paths.html#PathData
 * http://snapsvg.io/docs/#Paper.path
 */
export default {
	CLOSEPATH: 'Z', // PARAMS (none)
	MOVETO   : 'M', // PARAMS (x y)+
	LINETO   : 'L', // PARAMS (x y)+
	HLINETO  : 'H', // PARAMS x+
	VLINETO  : 'V', // PARAMS v+
	rHLINETO : 'h', // PARAMS x+
	rVLINETO : 'v', // PARAMS v+
	ARCTO    : 'A', // elliptical curve rather than a Bezier curve
 	CUBCURVETO  : 'C', // Bezier curve
									// PARAMS (x1 y1 x2 y2 y)+
	SMOOTHCURVE: 'S', // Smooth Bezier curve
                	// PARAMS (x2 y2 y)+
	QUADCURVETO : 'Q', // Quadratic Bezier curve
                	// PARAMS (x1 y1 y)+
	SMOOTHQUAD: 'T', // Smooth Quadratic Bezier curve
                	// PARAMS (x y)+
	// CATMUL   : 'R', // Catmull-Rom curveto - not a standard svg command
	              	// PARAMS x1 y1 (x y)+
};


/*
SuperCanvas
const PATH_LENGTHS = {
    'L': 2,
    'M': 2,
    'C': 6,
    'S': 4,
    'Q': 4,
    'T': 2,
    'A': 7,
    'V': 1,
    'H': 1,
};
*/
