/* jshint esnext: true */

import {convertStyle} from './lib/style-properties';
import {convertTransform} from './lib/transform-properties';
import drawPath from './primitives/path';
import arcband from '../../geoms/custom/arcBand';
import petal from '../../geoms/custom/petal';
import polyline from '../../geoms/primitives/polyline';
import polylineradial from '../../geoms/primitives/polylineradial';

import dot       from './primitives/dot.js';
import dotsquare from './primitives/dotSquare.js';
import rect      from './primitives/rect.js';

var PATH = {arcband, petal, polyline, polylineradial};

const arcband2 = ( {x, y, radius, startAngle, endAngle, anticlockwise} ) => {
//   {shape: {"startAngle":2.30,"endAngle":2.76,"innerRadius":56,"outerRadius":112},"style":{fill: "orange"},"transform": {"rotate":0}},

  return {
    bbs: null,
    cmds: [
      ["beginPath"],
      ["arc",[0,0,112,0.7292036732051035,1.1892036732051035,0]],
      ["lineTo",[20.854346207803115,51.972071771722625]],
      ["arc",[0,0,56,1.1892036732051032,0.7292036732051033,1]],
      ["closePath"]
    ]
  };

}

var GEOM = {dot,dotsquare, rect};

const svgList = (anchors) => {
  return anchors.map((d) => {
    return d.valueOf();
  });
};

const shapeData = (geom, shape) => {
  let data;
  if(GEOM.hasOwnProperty(geom)) {
    data = GEOM[geom](shape);
  } else {
    var pth = PATH[geom](shape);
    data = drawPath(svgList(pth));
  }
  return data;
};

const renderGeom = (geom) => {
  const asCmd  = function(cmd, args)   { return ['cmd', cmd, args];    };
  const asProp = function(prop, value) { return ['prop', prop, value]; };

  return (data) => {
    const {shape, style, transform} = data;
    const {bb, cmds} = shapeData(geom, shape);
    var instructions = [];
    convertTransform(transform).forEach((cmds) => {
      cmds.forEach((c) => {
        instructions.push(asCmd(...c));
      });
    });

    if(!style.hasOwnProperty('fill')) { style.fill = 'black'; }
    convertStyle(style).forEach((d) => {
      var [k,v] = d;
      instructions.push(asProp(k, v));
    });

    cmds.forEach((d) => {
      var [cmd,args] = d;
      instructions.push(asCmd(cmd, args));
    });

    if(style.hasOwnProperty('fill'))   { instructions.push(asCmd('fill'));  }
    if(style.hasOwnProperty('stroke')) { instructions.push(asCmd('stroke')); }
    return instructions;
  };
};

const paintGeomInstructions = (ctx) => {
  return (instructions) => {
    if(!Array.isArray(instructions) || !instructions.length) { return; }
    ctx.save();
    instructions.forEach((d, i) => {
      var [type, key, args] = d;
      if(type === 'cmd') {
        if(/^(fill|stroke)$/.exec(key)) { args = null; }
        if(args) {
          ctx[key](...args);
        } else {
          ctx[key]();
        }
      } else if(type === 'prop') {
        ctx[key] = args;
      }
    });
    ctx.restore();
  };
};

const renderSeries = (geom, series, container) => {
  container.innerHTML = '<div>canvas</div>';
  var canvas = document.createElement('canvas');
  var ctx    = canvas.getContext('2d');
  var renderItem = renderGeom(geom);
  var paint = paintGeomInstructions(ctx);
  series.forEach((d) => {
    paint(renderItem(d));
  });
  container.appendChild(canvas);
};

export default {renderSeries, name: 'canvas'};
