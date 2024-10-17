import React from 'react';
import { Grid, Typography } from '@mui/material';
import Papa from 'papaparse';
import Loading from '../common/Loading';
import { lightColors, hexToRGBA, quickHull } from '../../utils';
import MapCanvas from './MapCanvas';


class Clusters extends React.Component {
  
  data: any[] = [];

  state: any = {
    dots: null,
    clusterBorders: null
  }

  width = 500;
  height = 500;

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch('/clustering/clustering.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,       
          skipEmptyLines: true, 
          complete: (result: any) => {
            this.data = result.data ;
            this.updateChart();
          },
        });
      })
      .catch(error => alert('Error fetching or parsing CSV:'+ error));
  }

  updateChart() {
    if (this.data === null || this.data.length === 0) return ;
    console.log('Updating plot...');
    const dots: any[] = this.data.map((row) => ({
      x0: parseFloat(row.z1_x),
      y0: parseFloat(row.z1_y),
      cluster: parseInt(row.z1_cluster)
    })) ;
    let minX = null ;
    let maxX = null ;
    let minY = null ;
    let maxY = null ;
    for (let dot of dots) {
      if (minX === null || dot.x0 < minX) minX = dot.x0 ;
      if (maxX === null || dot.x0 > maxX) maxX = dot.x0 ;
      if (minY === null || dot.y0 < minY) minY = dot.y0 ;
      if (maxY === null || dot.y0 > maxY) maxY = dot.y0 ;
    }
    const scaleX = (maxX - minX) / this.width;
    const scaleY = (maxY - minY) / this.height;
    console.log('2D Space', minX, maxX, minY, maxY, scaleX, scaleY);
    for (let dot of dots) {
      const color = lightColors[dot.cluster % lightColors.length] ;
      dot.c = hexToRGBA(color, 0.5) ;
      dot.c = color ;
      dot.x = (dot.x0 - minX) / scaleX;
      dot.y = (dot.y0 - minY) / scaleY;
    }
    console.log('Transformed x,y to canvas scale.');
    const clusterDots: any = {} ;
    for (let dot of dots) {
      if (clusterDots[dot.cluster] === undefined) {
        clusterDots[dot.cluster] = [] ;
      }
      clusterDots[dot.cluster].push(dot) ;
    }
    console.log('Number of clusters', Object.keys(clusterDots).length);
    const clusterBorders: any[] = [] ;
    for (let cluster of Object.keys(clusterDots)) {
      console.log('Calculating borders of cluster', cluster, clusterDots[cluster].length);
      const hull = quickHull(clusterDots[cluster]);
      console.log('Hull', hull);
      clusterBorders.push({id: cluster, hull: hull}) ;
    }
    console.log('Cluster borders', clusterBorders);
    this.setState({dots, clusterBorders});
  }

  renderPlot() {
    if (this.state.dots) {
      return (
        <Grid item xs={6} >
          <MapCanvas dots={this.state.dots} clusterBorders={this.state.clusterBorders} width={this.width} height={this.height}/>
        </Grid>  
      )
    } else {
      return <Grid item xs={12} ><Loading /></Grid>     
    }
  }

  render() {
    return (
       <Grid container spacing={3}>
          <Grid item xs={12} >
            <Typography>#TODO: actions and selections will go here</Typography>
          </Grid>     
          {this.renderPlot()}  
      </Grid>
    );
  }
}

export default Clusters;
