/* jshint esnext: true */

var convertTransform = (function() {

  const trim = (s) => { return s.replace(/^\s+|\s+$/g, ''); };
  const compressSpaces = (s) => { return s.replace(/[\s\r\t\n]+/gm,' '); };
  const objectEntries = (o) => {
    return Object.keys(o).reduce((acc, d) => {
      acc.push([d, o[d]]);
      return acc;
    }, []);
  };

  const toRadians = (angle) => {
    if(angle === undefined) { return 0; }
    var s = angle.toString();
    var n = parseFloat(angle);
    if (s.match(/grad$/)) return n * (Math.PI / 200.0);
    if (s.match(/rad$/)) return n;
    return n * (Math.PI / 180.0);
  };
  const toNumberArray = (s) => {
    s = (s.toString() || '').replace(/,/g, ' ');
    var a = trim(compressSpaces(s)).split(' ');
    for (var i=0; i<a.length; i++) {
      a[i] = parseFloat(a[i]);
    }
    return a;
  };


  var FN = {};
  // getData
  FN.rotate = function(s) {
    var [deg, cx, cy] = toNumberArray(s);
    var rotate = ['rotate', [toRadians(deg)]];
    if(cx || cy) {
      if(cx === undefined) { cx = 0; }
      if(cy === undefined) { cy = 0; }
      return [['rotate', [toRadians(deg), cx, cy]]];
    } else {
      return [['rotate', [toRadians(deg)]]];
    }
  };

  FN.translate = function([x,y]) {
    return [ ['translate', [x || 0.0, y || 0.0]] ];
  };

  FN.scale = function([x,y]) {
    return [ ['scale', [x || 1.0, y || x || 1.0]] ];
  };

  FN.matrix = function([m0,m1,m2,m3,m4,m5]) {
    return [ ['transform', [m0, m1, m2, m3, m4, m5]] ];
  };

  FN.skewX = function(angle) {
    var m = [1, 0, Math.tan(toRadians(angle)), 1, 0, 0];
    return [ ['transform', [m[0], m[1], m[2], m[3], m[4], m[5]]] ];
  };
  FN.skewY = function(angle) {
    var m = [1, Math.tan(toRadians(angle)), 0, 1, 0, 0];
    return [ ['transform', [m[0], m[1], m[2], m[3], m[4], m[5]]] ];
  };

  return (transform) => {
    if(!transform) { return []; }
    var rotate = transform.rotate;
    var translate = transform.translate;
    var revert = {};
    if(rotate && !Array.isArray(rotate)) { rotate = [rotate]; }
    return objectEntries(transform).reduce((acc,d) => {
      var [type, value] = d;
      if(FN.hasOwnProperty(type)) {
        acc.push(new FN[type](value));
      }
      return acc;
    }, []);
  };

} ());

module.exports = {convertTransform};
