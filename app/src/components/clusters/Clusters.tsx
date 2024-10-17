import React from 'react';
import { Grid, Typography, Box, FormControl, Select, MenuItem } from '@mui/material';
import Papa from 'papaparse';
import { interpolateViridis } from 'd3-scale-chromatic';
import Loading from '../common/Loading';
import { clusteringFeatures, lightColors, quickHull } from '../../utils';
import MapCanvas from './MapCanvas';
import LegendLinear from './LegendLinear';
import LegendCategorical from './LegendCategorical';


class Clusters extends React.Component {
  
  data: any[] = [];

  state: any = {
    zoom: 1,
    colorBy: 'cluster',
    dots: null,
    isCategorical: false,
    colorMap: null,
    clusterBorders: null,
    hoveredCluster: null,
    selectedCluster: null
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

  handleColorByChange = (event: any) => {
    this.setState({ colorBy: event.target.value }, this.updateChart);
  };

  setHoveredCluster = (clusterId: number) => {
    this.setState({hoveredCluster: clusterId});
  }

  setSelectedCluster = (clusterId: number) => {
    this.setState({selectedCluster: clusterId});
  }

  updateChart = () => {
    if (this.data === null || this.data.length === 0) return ;
    const t0 = performance.now();
    const zoom = this.state.zoom ;
    const colorBy = this.state.colorBy ;
    const fieldColor = colorBy === 'cluster' ? 'z'+zoom+'_cluster' : colorBy ;
    const fieldCluster = 'z'+zoom+'_cluster' ;
    const fieldX = 'z'+zoom+'_x' ;
    const fieldY = 'z'+zoom+'_y' ;
    const isCategorical = colorBy==='cluster' || colorBy==='user_lang_1' ;
    const dots: any[] = this.data.map((row) => ({
      x0: parseFloat(row[fieldX]),
      y0: parseFloat(row[fieldY]),
      cluster: parseInt(row[fieldCluster]),
      colorValue: isCategorical ? (row[fieldColor]?''+row[fieldColor]:'null') : parseFloat(row[fieldColor])
    })) ;
    let minX = null ;
    let maxX = null ;
    let minY = null ;
    let maxY = null ;
    let uniqueColorValues: any = new Set() ;
    for (let dot of dots) {
      if (minX === null || dot.x0 < minX) minX = dot.x0 ;
      if (maxX === null || dot.x0 > maxX) maxX = dot.x0 ;
      if (minY === null || dot.y0 < minY) minY = dot.y0 ;
      if (maxY === null || dot.y0 > maxY) maxY = dot.y0 ;
      if (isCategorical) {
        uniqueColorValues.add(dot.colorValue) ;
      }
    }
    let colorMap: any = null ;
    if (isCategorical) {
      uniqueColorValues = [...uniqueColorValues].sort((a, b) => a - b);
      colorMap = {} ;
      for (let i = 0; i < uniqueColorValues.length; i++) {
        colorMap[uniqueColorValues[i]] = lightColors[i % lightColors.length] ;
      }
      console.log('colorMap', colorMap) ;
    } 
    const scaleX = (maxX - minX) / this.width;
    const scaleY = (maxY - minY) / this.height;
    for (let dot of dots) {
      const color = colorMap ? colorMap[dot.colorValue] : interpolateViridis(dot.colorValue) ;
      dot.c = color ;
      dot.x = (dot.x0 - minX) / scaleX;
      dot.y = (dot.y0 - minY) / scaleY;
    }
    const clusterDots: any = {} ;
    for (let dot of dots) {
      if (clusterDots[dot.cluster] === undefined) {
        clusterDots[dot.cluster] = [] ;
      }
      clusterDots[dot.cluster].push(dot) ;
    }
    const clusterBorders: any[] = [] ;
    for (let cluster of Object.keys(clusterDots)) {
      const hull = quickHull(clusterDots[cluster]);
      clusterBorders.push({id: cluster, hull: hull}) ;
    }
    const t1 = performance.now();
    console.log('updateChart took', t1 - t0, 'ms');
    this.setState({dots, clusterBorders, isCategorical, colorMap});
  }


  renderInputs() {
    if (this.state.dots) {
      return (
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
          <Typography variant="body2">Color users by</Typography>
          <FormControl>
            <Select value={this.state.colorBy} onChange={this.handleColorByChange}>
              {Object.entries(clusteringFeatures).map(([feature, label], index) => (
                <MenuItem key={index} value={feature}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )
    } else {
      return<Loading />     
    }
  }

  renderPlot() {
    if (this.state.dots) {
      return (
        <MapCanvas dots={this.state.dots} 
                   clusterBorders={this.state.clusterBorders} 
                   width={this.width} 
                   height={this.height}
                   hoveredCluster={this.state.hoveredCluster}
                   setHoveredCluster={this.setHoveredCluster}
                   setSelectedCluster={this.setSelectedCluster}
        />  
      )
    }
  }

  renderLegend() {
    if (this.state.dots) {
      const label = clusteringFeatures[this.state.colorBy] ;
      if (this.state.isCategorical && this.state.colorMap) {
        return (
          <LegendCategorical colorMapping={this.state.colorMap} width={this.width} title={label}/>
        )
      } else {
        return (
          <LegendLinear width={this.width} title={label}/>
        )
      }
    }
  }

  renderDetails() {
    if (this.state.hoveredCluster) {
      return (
        <Typography>hovered cluster: {this.state.hoveredCluster}</Typography>
      )
    }
  }

  render() {
    return (
       <Grid container spacing={3}>
          <Grid item xs={12} >
            <Typography variant="h6">Map of users active in the last 30 days</Typography>
          </Grid>     
          <Grid item xs={12} >
            {this.renderInputs()}
          </Grid>    
          <Grid item xs={12} md={6}>
            {this.renderPlot()}
            {this.renderLegend()}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.renderDetails()}
          </Grid>
      </Grid>
    );
  }

}

export default Clusters;
