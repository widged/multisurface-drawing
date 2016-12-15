/* jshint esnext: true */

import React from 'react';
import ReactDom from 'react-dom';
import TabbedContainer     from '../../components/tabbed-container/TabbedContainer.jsx';
import geomMocks from './GeomMocks';


import SectionsGrid  from './SectionsGrid.jsx';
import SurfaceContainer    from '../surface/SurfaceContainer.jsx';
import svgSurface    from '../surface/svg-surface/svgSurface.jsx';
import canvasSurface from '../surface/canvas-surface/canvasSurface.jsx';
import webglSurface  from '../surface/webgl-surface/webglSurface.jsx';


const {Component} = React;

class GeomSeries extends Component {

  constructor(props) {
    super(props);
    this.bound  = {
      whenTick: this.whenTick.bind(this)
    };
  }

  whenTick({time}, container) {
    const {surface, geom, series} = this.props;
    surface.renderSeries(geom, series, container);
  }

 render() {
   const {whenTick} = this.bound;
   const {geom} = this.props;
   return (
        <SurfaceContainer whenTick={whenTick} realtime={false} />
   );
 }
}

class App extends Component {
  constructor(props) {
    super(props);
    var geoms = geomMocks;
    var geoms2 = geomMocks.slice(5,6) // .filter((d) => { return d.geom === 'arcband'; });
    this.state = {
      svgGeoms: geoms.map(this.renderGeom(svgSurface)),
      canvasGeoms: geoms.map(this.renderGeom(canvasSurface)),
      webglGeoms: geoms.map(this.renderGeom(webglSurface))
    }
  }

  renderGeom(surface) {
      return ({geom,series}, i) => {
          return (<GeomSeries title={geom} geom={geom} series={series} surface={surface} />);
      };
  }

  render() {
    const {svgGeoms, canvasGeoms, webglGeoms} = this.state;
    return <TabbedContainer>
      <page tab="Webgl surface"><SectionsGrid sections={webglGeoms}></SectionsGrid></page>
      <page tab="Canvas surface"><SectionsGrid sections={canvasGeoms}></SectionsGrid></page>
      <page tab="SVG surface"><SectionsGrid sections={svgGeoms}></SectionsGrid></page>
    </TabbedContainer>
  }
}


export default App;
