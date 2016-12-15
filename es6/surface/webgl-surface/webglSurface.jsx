/* jshint esnext: true */

import React from 'react';
 import * as PIXI from './pixi.js';
import {convertStyle} from '../canvas-surface/lib/style-properties';
import {convertTransform} from '../canvas-surface/lib/transform-properties';
import drawPath from '../canvas-surface/primitives/path';
import arcband from '../../geoms/custom/arcBand';
import petal from '../../geoms/custom/petal';
import polyline from '../../geoms/primitives/polyline';
import polylineradial from '../../geoms/primitives/polylineradial';
import rgbcolor from './rgbcolor';

import dot       from './primitives/dot.js';
import dotsquare from '../canvas-surface/primitives/dotSquare.js';
import rect      from '../canvas-surface/primitives/rect.js';


var PATH = {arcband, petal, polyline, polylineradial};

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
    let {transform} = data;
    const {shape, style} = data;
    const {bb, cmds} = shapeData(geom, shape);
    var instructions = [];

    if(transform) {
      var {rotate, translate} = transform;
      if(rotate, translate) {
        transform = { rotate: [rotate, ...translate], translate };
      }
    }
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
    instructions.forEach((d, i) => {
      var [type, key, args] = d;
      if(['beginPath','closePath'].includes(key))  { return; }
      if(['save','restore'].includes(key))  { return; }
      if(key === 'translate') {
        // ctx.position = new PIXI.Point(...args);
        return;
      }
      if(key === 'fill') { key = "endFill"; }
      if(type === 'prop' && key === 'fillStyle') {
        type = 'cmd';
        key = 'beginFill';
        var x = new rgbcolor(args).toHex(args[0]).replace('#','');
        var hx = parseInt('0x'+x, 16);
        args = [hx];
     }
     if(key === 'rotate') {
       type = 'prop';
       key = 'rotation';
     }
      if(type === 'cmd') {
        // if(/^(fill|stroke)$/.exec(key)) { args = null; }
        if(args) {
          ctx[key](...args);
        } else {
          ctx[key]();
        }
      } else if(type === 'prop') {
        if(key === 'rotation' && args.length === 3) {
          ctx.pivot.set(-args[1],-args[2]);
          ctx.position = new PIXI.Point(0,0);
          // ctx.pivot.set(+args[1],+args[2]);
        }
        if(Array.isArray(args)) { args = args[0]; }
        ctx[key] = args;
      }
    });
  };
};

const renderSeries = (geom, series, container) => {
  // canvas = PIXI.CanvasRenderer
  // webgl = PIXI. WebGLRenderer
  container.innerHTML = '<div>webgl</div>';
  var renderer = new PIXI.WebGLRenderer(300,200, { transparent: true, antialias: true });
  renderer.view.style.width = 300 + "px";
  renderer.view.style.height = 200 + "px";
  renderer.view.style.display = "block"; // HTMLCanvasElement
  container.appendChild(renderer.view);

  var stage = new PIXI.Container();

  var renderItem = renderGeom(geom);
  series.forEach((d) => {
    var gfx = new PIXI.Graphics();
    gfx.beginFill(0x000000);
    var paint = paintGeomInstructions(gfx);
    var cmds = renderItem(d);
    paint(cmds);
    stage.addChild(gfx);
  });

  renderer.render(stage);

};

export default {renderGeom, renderSeries, name: 'canvas'};

/*
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="70px" height="70px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
  ${shapes.join('\n')}
</svg>`;

*/
