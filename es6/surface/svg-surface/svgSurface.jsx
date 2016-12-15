/* jshint esnext: true */

import arcband from  '../../geoms/custom/arcBand';
import petal from    '../../geoms/custom/petal';
import polyline from '../../geoms/primitives/polyline';
import polylineradial from '../../geoms/primitives/polylineradial';

import dot       from './primitives/dot.js';
import dotsquare from './primitives/dotSquare.js';
import rect      from './primitives/rect.js';

const svgNS = "http://www.w3.org/2000/svg";

var GEOM = {dot, dotsquare, rect};
var PATH = {arcband, petal, polyline, polylineradial};

const svgString = (anchors) => {
  return anchors.map((d) => {
    return d.svgString();
  }).join('');
};

const shapeData = (geom, shape) => {
  var data;
  if(GEOM.hasOwnProperty(geom)) {
    data = GEOM[geom](shape);
  } else {
    var pth = PATH[geom](shape);
    data = {type: 'path', props: { d: svgString(pth) }};
  }
  return data;
};

const convertStyle = (props) => {
  // style="fill: red; stroke: blue; stroke-width: 3"
  return Object.keys(props).map((k) => {
    return [k, props[k]].join(': ');
  }).join('; ');
};


const convertTransform = (transform) => {
  var {rotate, translate} = transform || {};
  var out = [];
  if(rotate)    { out.push('rotate('+ (rotate || 0) +')'); }
  if(translate) { out.push('translate('+ (translate.join(', ') || "0, 0") +')'); }
  return out.join(' ');
};

const renderGeom = (geom) => {
  return (data) => {
    const {shape, style, transform} = data;
    var {type, props} = shapeData(geom, shape);
    var attrs = Object.assign(props, {
      style: convertStyle(style),
      transform: convertTransform(transform)
    });
    var node = document.createElementNS(svgNS,type);
    Object.keys(attrs).forEach((k) => {
      const v = attrs[k];
      node.setAttributeNS(svgNS,k,v);
    });
    return node;
  };
};

const renderSeries = (geom, series, container) => {
  container.innerHTML = '<div>svg</div>';
  var g   = document.createElementNS(svgNS,"g");
  var renderItem = renderGeom(geom);
  series.map(renderItem).forEach((node) => {
    g.appendChild(node);
  });

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.appendChild(g);

  var div = document.createElement('div');
  div.innerHTML = svg.outerHTML;
  var svg2 = div.querySelector('svg');
  // for some weird reason, it repaints with svg2 but not svg (eventhough the svg is visible in the underlying html)
  container.appendChild(svg2);
};


export default {renderGeom, renderSeries, name: 'svg'};

/*
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="70px" height="70px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
  ${shapes.join('\n')}
</svg>`;

*/
