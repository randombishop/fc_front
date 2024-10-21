import React from 'react';
import { Grid, Typography, Box, FormControl, Select, MenuItem, Breadcrumbs, Button, Chip } from '@mui/material';
import Papa from 'papaparse';
import { interpolateViridis } from 'd3-scale-chromatic';
import Loading from '../common/Loading';
import { clusteringCategories, clusteringFeatures, lightColors, quickHull } from '../../utils';
import MapCanvas from './MapCanvas';
import LegendLinear from './LegendLinear';
import LegendCategorical from './LegendCategorical';


class Clusters extends React.Component {

  metadata: any = null ;
  data: any[]|null = null ;
  fids: any = null ;
  
  state: any = {
    colorByCategory: 'Clustering',
    colorBy: 'cluster',
    dots: null,
    isCategorical: false,
    colorMap: null,
    clusterBorders: null,
    hoveredCluster: null,
    selectedClusters: [],
    hoveredDot: null
  }

  width = 500;
  height = 500;

  componentDidMount() {
    this.loadJsonFiles(() => {
      this.loadCsvFile(() => {
        this.updateChart() ;
      }) ;
    }) ;
  }

  loadJsonFiles = (next: () => void) => {
    const urls = [
      "/clustering/clusters1.json",
      "/clustering/clusters2.json",
      "/clustering/clusters3.json",
      "/clustering/clusters4.json",
    ];
    Promise.all(urls.map(url => fetch(url).then(res => res.json())))
      .then((results) => {
        this.metadata = {} ;
        for (let c of results[0]) {
          this.metadata[''+c['z1_cluster']] = c ;
        }
        for (let c of results[1]) {
          this.metadata[c['z1_cluster']+'/'+c['z2_cluster']] = c ;
        }
        for (let c of results[2]) {
          this.metadata[c['z1_cluster']+'/'+c['z2_cluster']+'/'+c['z3_cluster']] = c ;
        }
        for (let c of results[3]) {
          this.metadata[c['z1_cluster']+'/'+c['z2_cluster']+'/'+c['z3_cluster']+'/'+c['z4_cluster']] = c ;
        }
        next() ;
      })
      .catch(error => console.error("Error loading JSON files:", error));
  }

  loadCsvFile = (next: () => void) => {
    fetch('/clustering/clustering.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,       
          skipEmptyLines: true, 
          complete: (result: any) => {
            this.data = result.data ;
            this.fids = {} ;
            for (let row of result.data) {
              this.fids[row['user_fid']] = row ;
            }
            next();
          },
        });
      })
      .catch(error => alert('Error fetching or parsing CSV:'+ error));
  }

  handleColorByCategoryChange = (event: any) => {
    const colorByCategory = event.target.value ;
    const filteredFeatures = Object.entries(clusteringFeatures).filter(([key, feature]: any) => (feature.category === colorByCategory)) ;
    const colorBy = filteredFeatures[0][0] ;
    this.setState({ colorByCategory, colorBy }, this.updateChart);
  };

  handleColorByChange = (event: any) => {
    this.setState({ colorBy: event.target.value }, this.updateChart);
  };

  setHoveredCluster = (clusterId: number) => {
    this.setState({hoveredCluster: clusterId});
  }

  setSelectedCluster = (clusterId: number) => {
    const selectedClusters = [...this.state.selectedClusters, clusterId] ;
    this.setSelectedClusters(selectedClusters) ;
  }

  setSelectedClusters = (selectedClusters: any[]) => {
    const hoveredCluster = null ;
    this.setState({selectedClusters, hoveredCluster}, this.updateChart);
  }

  setHoveredDot = (fid: string) => {
    this.setState({hoveredDot: fid}) ;
  }

  getFilteredData = () => {
    if (this.data === null) return [] ;
    const selectedClusters = this.state.selectedClusters ;
    if (selectedClusters.length === 0) {
      return this.data ;
    } else {
      return this.data.filter(
        (row) => {
          for (let i=0 ; i<selectedClusters.length ; i++) {
            if ((''+row['z'+(i+1)+'_cluster']) !== (''+selectedClusters[i])) return false ;
          }
          return true ;
        }
      ) ;
    }
  }

  updateChart = () => {
    if (this.data === null || this.data.length === 0) return ;
    const t0 = performance.now();
    const zoom = this.state.selectedClusters.length + 1 ;
    const colorBy = this.state.colorBy ;
    const fieldColor = colorBy === 'cluster' ? 'z'+zoom+'_cluster' : colorBy ;
    const fieldCluster = 'z'+zoom+'_cluster' ;
    const fieldX = 'z'+zoom+'_x' ;
    const fieldY = 'z'+zoom+'_y' ;
    const isCategorical = clusteringFeatures[colorBy].isCategorical ;
    const data = this.getFilteredData() ;
    const dots: any[] = data.map((row) => ({
      fid: row['user_fid'],
      x0: (row[fieldX] && row[fieldX]!=='') ? parseFloat(row[fieldX]) : parseFloat(row['z'+(zoom-1)+'_x']),
      y0: (row[fieldY] && row[fieldY]!=='') ? parseFloat(row[fieldY]) : parseFloat(row['z'+(zoom-1)+'_y']),
      cluster: parseInt(row[fieldCluster]),
      colorValue: isCategorical ? (row[fieldColor]?''+row[fieldColor]:'null') : parseFloat(row[fieldColor])
    })) ;
    let clustered = false ;
    let minX = null ;
    let maxX = null ;
    let minY = null ;
    let maxY = null ;
    const uniqueColorValues:any = {} ;
    for (let dot of dots) {
      if (dot.cluster) clustered = true ;
      if (minX === null || dot.x0 < minX) minX = dot.x0 ;
      if (maxX === null || dot.x0 > maxX) maxX = dot.x0 ;
      if (minY === null || dot.y0 < minY) minY = dot.y0 ;
      if (maxY === null || dot.y0 > maxY) maxY = dot.y0 ;
      if (isCategorical) {
        if (uniqueColorValues[dot.colorValue]) {
          uniqueColorValues[dot.colorValue] += 1 ;
        } else {
          uniqueColorValues[dot.colorValue] = 1 ;
        }
      }
    }
    let colorMap: any = null ;
    if (isCategorical) {
      colorMap = {} ;
      const max_unique = 10 ;
      const uniqueColorKeys = Object.keys(uniqueColorValues) ;
      if (uniqueColorKeys.length <= max_unique) {
        for (let i = 0; i < uniqueColorKeys.length; i++) {
          colorMap[uniqueColorKeys[i]] = lightColors[i % lightColors.length] ;
        }
      } else {
        // find top most common values     
        const top = Object.entries(uniqueColorValues).sort((a: any, b: any) => b[1] - a[1]).slice(0, max_unique-1) ;
        for (let i = 0; i < top.length; i++) {
          colorMap[top[i][0]] = lightColors[i % lightColors.length] ;
        }
        colorMap['others'] = lightColors[top.length % lightColors.length] ; 
        // replace values that are not in the top 10 with 'Others'
        for (let dot of dots) {
          if (!colorMap[dot.colorValue]) {
            dot.colorValue = 'others' ;
          }
        }
      }
    } 
    const pad = 10 ;
    const scaleX = (this.width-2*pad) / (maxX - minX) ;
    const scaleY = (this.height-2*pad) / (maxY - minY) ;
    for (let dot of dots) {
      const color = colorMap ? colorMap[dot.colorValue] : interpolateViridis(dot.colorValue) ;
      dot.c = color ;
      dot.x = (dot.x0-minX) * scaleX + pad ;
      dot.y = (dot.y0-minY) * scaleY + pad ;
    }
    const clusterBorders: any[] = [] ;
    if (clustered) {
      const clusterDots: any = {} ;
      for (let dot of dots) {
        if (clusterDots[dot.cluster] === undefined) {
          clusterDots[dot.cluster] = [] ;
        }
        clusterDots[dot.cluster].push(dot) ;
      }
      for (let cluster of Object.keys(clusterDots)) {
        const hull = quickHull(clusterDots[cluster]);
        clusterBorders.push({id: cluster, hull: hull}) ;
      }
    }
    const t1 = performance.now();
    console.log('updateChart took', t1 - t0, 'ms', 'zoom:', zoom);
    this.setState({dots, clusterBorders, isCategorical, colorMap});
  }





  // -----------------
  // RENDERING PART
  // -----------------

  renderTitle() {
    if (this.state.dots) {
      return <Typography variant="h6">Map of users active in the last 30 days</Typography> ;
    } else {
      return <Loading /> ;
    }
  }

  renderInputs() {
    if (!this.state.dots) return null ;
    const filteredCategories = [] ;
    for (let feature in clusteringFeatures) {
      const data = clusteringFeatures[feature] ;
      if (data.category===this.state.colorByCategory) {
        filteredCategories.push({feature: feature, label: data.label}) ;
      }
    }
    return (
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
        <Typography variant="body2">Color users by</Typography>
        <FormControl>
          <Select value={this.state.colorByCategory} onChange={this.handleColorByCategoryChange}>
            {clusteringCategories.map((category, index) => (
              <MenuItem key={index} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select value={this.state.colorBy} onChange={this.handleColorByChange}>
            {filteredCategories.map((data, index) => (
              <MenuItem key={index} value={data.feature}>{data.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    ) ;
  }

  renderBreadcrumbStep = (cluster:any, index:number) => {
    const pathClusters = this.state.selectedClusters.slice(0,index+1)
    const key = pathClusters.join('/') ;
    const metadata = this.metadata[key] ;
    const count = metadata.fid ;
    return (
      <Button key={key} 
              color="inherit" 
              disabled={this.state.selectedClusters.length === index+1}
              onClick={() => this.setSelectedClusters(pathClusters)}>
            Cluster #{cluster} ({count}) 
      </Button> 
    )
  }

  renderBreadcrumbs() {
    if (this.data === null) return null ;
    if (!this.state.dots) return null ;
    const numDots = this.data.length ;
    return (
      <React.Fragment>
        <Breadcrumbs separator="›" >
          <Button color="inherit" 
                  disabled={this.state.selectedClusters.length === 0}
                  onClick={() => this.setSelectedClusters([])}>
             All users ({numDots})
          </Button> 
          {this.state.selectedClusters.map(this.renderBreadcrumbStep)}         
        </Breadcrumbs>
        <hr/>
      </React.Fragment>
    )
  }

  renderPlot() {
    if (!this.state.dots) return null ;
    return (
      <MapCanvas dots={this.state.dots} 
                  clusterBorders={this.state.clusterBorders} 
                  width={this.width} 
                  height={this.height}
                  hoveredCluster={this.state.hoveredCluster}
                  setHoveredCluster={this.setHoveredCluster}
                  setSelectedCluster={this.setSelectedCluster}
                  hoveredDot={this.state.hoveredDot}
                  setHoveredDot={this.setHoveredDot}
      />  
    )
  }

  renderLegend() {
    if (!this.state.dots) return null ;
    const label = clusteringFeatures[this.state.colorBy].label ;
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

  renderClusterDetails() {
    if (!this.state.hoveredCluster) return null ;
    const zoom = this.state.selectedClusters.length + 1 ;
    let key = ''+this.state.hoveredCluster ;
    if (this.state.selectedClusters.length > 0) {
      key = this.state.selectedClusters.join('/') + '/' + key ;
    }
    const metadata = this.metadata[key] ;
    const size = metadata['fid'] ;
    const words = JSON.parse(metadata['z'+zoom+'_cluster_words']) ;
    const features = JSON.parse(metadata['z'+zoom+'_cluster_features']).filter((f:any) => clusteringFeatures[f.feature]) ;
    return (
      <div>
        <strong>Cluster:</strong> {key}
        <br/>
        <strong>Size:</strong> {size} users
        <br/><br/>
        <strong>Keywords:</strong> 
        {words.map((w:any, index:number) => <Chip key={index} label={w.word+':'+w.count} 
                                                  variant="outlined" 
                                                  style={{marginLeft: '10px', marginTop: '5px'}}/>)}
        <br/><br/>
        <strong>Features:</strong> 
        {features.map((f:any, index:number) => <Chip key={index} 
                                                  label={clusteringFeatures[f.feature].category+' / '+clusteringFeatures[f.feature].label} 
                                                  variant="outlined" 
                                                  style={{marginLeft: '10px', marginTop: '5px'}}
                                                  color={f.delta>0?'success':'error'}/>)}
      </div>
    )
  }

  renderDotDetails() {
    if (!this.state.hoveredDot) return null ;
    const user = this.fids[this.state.hoveredDot] ;
    if (!user) return null ;
    return (
      <div>
        <strong>hoveredDot:</strong> {this.state.hoveredDot}
        <br/>
        {JSON.stringify(user, null, 2)}
      </div>
    )
  }

  render() {
    return (
       <Grid container spacing={3}>
          <Grid item xs={12} >
            {this.renderTitle()}
          </Grid>     
          <Grid item xs={12} >
            {this.renderInputs()}
          </Grid> 
          <Grid item xs={12} >
            {this.renderBreadcrumbs()}
          </Grid> 
          <Grid item xs={12} md={6}>
            {this.renderPlot()}
            {this.renderLegend()}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.renderClusterDetails()}
            {this.renderDotDetails()}
          </Grid>
      </Grid>
    );
  }

}

export default Clusters;
