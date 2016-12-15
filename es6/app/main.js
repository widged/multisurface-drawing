/* jshint esnext: true */

import React from 'react';
import ReactDom from 'react-dom';
import SurfaceTabs from './SurfaceTabs.jsx';

function main() {
  var app = document.createElement('app');
  document.body.appendChild(app);
  ReactDom.render(<SurfaceTabs />, app);
}
main();
