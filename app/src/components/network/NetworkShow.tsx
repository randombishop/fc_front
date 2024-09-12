import React, { createRef } from 'react';
import { Grid, Box, Slider, Table, TableBody, TableCell, TableRow, Typography, Stack, Avatar, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import WordCloud from 'react-d3-cloud';
import * as d3 from 'd3';
import Panel from '../common/Panel';
import Loading from '../common/Loading';
import { timestampYYYY_MM_DD, parseWordDict } from '../../utils';

function findMaxIndex(array: any[], targetTs: number): number {
  let left = 0;
  let right = array.length - 1;
  let result = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid].ts <= targetTs) {
      result = mid;
      left = mid + 1; 
    } else {
      right = mid - 1; 
    }
  }
  return result;
}

function getConnectivity(num_users:number, num_links:number) {
  return 100 * num_links / (num_users * (num_users - 1)) ;
}

const TIME_TRAVEL_STEP_MS = 100 ;
const SIMULATION_WIDTH = 700 ;
const SIMULATION_HEIGHT = 600 ;
const NODE_RAY = 16 ;
const ZOOM_MIN = 0.1 ;
const ZOOM_MAX = 10 ;

class NetworkShow extends React.Component< {data: any, loading: boolean}> {
  
  state: any;
  graphRef: React.RefObject<SVGSVGElement>;
  simulation: any;
  zoom: any;
  svgNode: any;
  svgLink: any;
  svgContainer: any;
  links: any[];
  nodes: any[];



  // -----------------------------
  // Component Lifecycle
  // -----------------------------

  constructor(props:any) {
    super(props) ;
    this.state  = {
      ts: 0,
      minTS: 0,
      maxTS: 0,
      num_users: 0,
      num_links: 0,
      connectivity: 0,
      selectedUser: null,
      timeTravel: false,
      autoFit: true
    } ;
    this.graphRef = createRef();
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d:any) => (d.id)).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(SIMULATION_WIDTH / 2, SIMULATION_HEIGHT / 2))
      .force('radial', d3.forceRadial(300, SIMULATION_WIDTH / 2, SIMULATION_HEIGHT / 2)) ;
    this.zoom = d3.zoom().scaleExtent([ZOOM_MIN, ZOOM_MAX]).on('zoom', this.handleZoom);
    this.svgNode = null ;
    this.svgLink = null ;
    this.links = [] ;
    this.nodes = [] ;
  }

  componentDidMount() {
    this.createGraph() ;
    this.handleNewData() ;
  }

  componentDidUpdate(prevProps:any) {
    if (prevProps.data !== this.props.data) {
      this.handleNewData() ;
    }
  }

  componentWillUnmount() {
    this.simulation.stop();
  }




  // -----------------------------
  // GRAPH FEATURES
  // HAPPEN OUTSIDE OF REACT LOOP
  // -----------------------------

  createGraph = () => {
    if (!this.graphRef.current) {
      console.log('create graph called before svg element is referenced') ;
      return ;
    }
    if (this.svgNode || this.svgLink) {
      console.log('create graph called but svg elements already exist') ;
      return ;
    }
    // Set graph dimensions
    const svg = d3.select(this.graphRef.current)
      .attr('width', SIMULATION_WIDTH)
      .attr('height', SIMULATION_HEIGHT);
    // Init links element
    this.svgContainer = svg.append('g');
    this.svgLink = this.svgContainer.append('g')
      .attr('class', 'links')
      .selectAll('line');
    // Init nodes element
    this.svgNode = this.svgContainer.append('g')
      .attr('class', 'nodes')
      .selectAll('image');
    console.log('created graph') ;
  }

  handleZoom = (event:any) => {
    this.svgContainer.attr('transform', event.transform); 
  }

  updateGraph() {
    // Update the links
    this.svgLink = this.svgLink.data(this.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5);
    // Update the nodes
    this.svgNode = this.svgNode.data(this.nodes)
      .join('image')
      .attr('xlink:href', (d:any) => d.pfp)
      .attr('width', NODE_RAY*2)
      .attr('height', NODE_RAY*2)
      .attr('x', -NODE_RAY) 
      .attr('y', -NODE_RAY) 
      .attr('clip-path', 'circle(' + NODE_RAY + ')')
      .call(d3.drag().on('start', this.onDragStart).on('drag', this.onDragged).on('end', this.onDragEnd));
    // Restart the simulation with the updated nodes and links
    this.simulation.nodes(this.nodes).on('tick', this.ticked);
    this.simulation.force('link').links(this.links);
    this.simulation.alpha(1).restart();
  }

  onDragStart = (event:any, d:any) => {
    if (!event.active) this.simulation.alphaTarget(0.3).restart(); // Reheat the simulation
    d.fx = d.x;
    d.fy = d.y;
  }

  onDragged = (event:any, d:any) => {
    d.fx = event.x;
    d.fy = event.y;
  }

  onDragEnd = (event:any, d:any) => {
    if (!event.active) this.simulation.alphaTarget(0); // Cool the simulation
    d.fx = null;
    d.fy = null;
  }

  ticked = () => {
    this.svgLink
      .attr('x1', (d:any) => d.source.x)
      .attr('y1', (d:any) => d.source.y)
      .attr('x2', (d:any) => d.target.x)
      .attr('y2', (d:any) => d.target.y);
    this.svgNode
      .attr('x', (d:any) => d.x - 16) 
      .attr('y', (d:any) => d.y - 16);
    if (this.state.autoFit) {
      this.autozoom() ;
    }
  }

  autozoom = () => {
    if (!this.graphRef.current) {
      return ;
    }
    const svg = d3.select(this.graphRef.current);
    const nodes = this.nodes;
    if (nodes.length === 0) {
      return ;
    }
    const bbox = this.svgContainer.node().getBBox();
    const padding = 40;
    const width = (2 * padding) + bbox.width;
    const height = (2 * padding) + bbox.height;
    const midX = bbox.x + (width / 2) - padding;
    const midY = bbox.y + (height / 2) - padding;
    const scale = Math.min(
      SIMULATION_WIDTH / width,
      SIMULATION_HEIGHT / height,
      ZOOM_MAX
    );
    svg.transition().duration(TIME_TRAVEL_STEP_MS).call(
        this.zoom.transform,
        d3.zoomIdentity
          .translate(SIMULATION_WIDTH / 2, SIMULATION_HEIGHT / 2)
          .scale(scale)
          .translate(-midX, -midY) // Translate to the center of the bounding box
      );
  }

  // ------------------------ 
  // REACT COMPONENT FEATURES
  // ------------------------

  handleNewData() {
    const data = this.props.data ;
    if (!data || !data.nodes || !data.links) {
      const defaultState = {
        ts: 0,
        minTS: 0,
        maxTS: 0,
        num_users: 0,
        num_links: 0,
        connectivity: 0
      }
      this.setState(defaultState) ;
      return ;
    }
    const nodes = data.nodes ;
    const nodeMap:any = {} ;
    nodes.forEach((node:any) => {
      nodeMap[node.id] = node ;
    }) ;
    const links = data.links ;
    links.sort((a:any, b:any) => a.ts - b.ts) ;
    const initialLinks = Math.floor(links.length/25) ;
    const minTS = links[initialLinks].ts ;
    const maxTS = links[links.length - 1].ts ;
    const links2:any = [] ;
    for (let i = 0; i < initialLinks; i++) {
      const l = {
        source: links[i].source,
        target: links[i].target
      }
      links2.push(l) ;
    }
    const nodes2:any = [] ;
    const addedNodes:any = {} ;
    for (const link of links2) {
      if (!addedNodes[link.source] && nodeMap[link.source]) {
        const n = {
          id: nodeMap[link.source].id,
          name: nodeMap[link.source].name,
          pfp: nodeMap[link.source].pfp,
          features: nodeMap[link.source].features
        }
        nodes2.push(n) ;
        addedNodes[link.source] = true ;
      }
      if (!addedNodes[link.target] && nodeMap[link.target]) {
        const n = {
          id: nodeMap[link.target].id,
          name: nodeMap[link.target].name,
          pfp: nodeMap[link.target].pfp,
          features: nodeMap[link.target].features
        }
        nodes2.push(n) ;
        addedNodes[link.target] = true ;
      }
    }
    const newState = {
      ts: minTS,
      minTS: minTS,
      maxTS: maxTS,
      num_users: nodes2.length,
      num_links: links2.length,
      connectivity: getConnectivity(nodes2.length, links2.length)
    }
    this.links = links2 ;
    this.nodes = nodes2 ;
    this.updateGraph() ;  
    this.setState(newState) ;
  }

  handleSliderChange = (event:any, value:any) => {
    const ts = value ;
    this.setTimestamp(ts, null) ;
  }

  setTimestamp(ts:number, callback:any) {
    const data:any = this.props.data ;
    const previousLinkCount = this.links.length ;
    const nextLinkCount = findMaxIndex(data.links, ts) + 1 ;
    let links:any[] = this.links ;
    let nodes:any[] = this.nodes ;
    const addedNodes:any = {} ;
    for (const node of nodes) {
      addedNodes[node.id] = true ;
    }
    const missingNodes:any = {} ;
    for (const node of data.nodes) {
      if (!addedNodes[node.id]) {
        missingNodes[node.id] = node ;
      }
    }
    if (nextLinkCount > previousLinkCount) {
      // Add new links and nodes
      links = links.slice() ;
      nodes = nodes.slice() ;
      for (let i = previousLinkCount; i < nextLinkCount; i++) {
        const newLink = {
          source: data.links[i].source,
          target: data.links[i].target
        }
        links.push(newLink) ;
        if (!addedNodes[newLink.source]) {
          const n = {
            id: missingNodes[newLink.source].id,
            name: missingNodes[newLink.source].name,
            pfp: missingNodes[newLink.source].pfp,
            features: missingNodes[newLink.source].features
          }
          nodes.push(n) ;
          addedNodes[newLink.source] = true ;
        }
        if (!addedNodes[newLink.target]) {
          const n = {
            id: missingNodes[newLink.target].id,
            name: missingNodes[newLink.target].name,
            pfp: missingNodes[newLink.target].pfp,
            features: missingNodes[newLink.target].features
          }
          nodes.push(n) ;
          addedNodes[newLink.target] = true ;
        }
      }
    } else if (nextLinkCount < previousLinkCount) {
      // Recreate clean links
      links = [] ;
      const keepNodes:any = {} ;
      for (let i = 0; i < nextLinkCount; i++) {
        const l = {
          source: data.links[i].source,
          target: data.links[i].target
        }
        links.push(l) ;
        keepNodes[l.source] = true ;
        keepNodes[l.target] = true ;
      }
      // Filter nodes and re-index them
      nodes = nodes.filter((node:any) => keepNodes[node.id]) ;
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].index = i ;
      }
    }
    const newState = {
      ts: ts,
      num_users: nodes.length,
      num_links: links.length,
      connectivity: getConnectivity(nodes.length, links.length)
    }
    this.links = links ;
    this.nodes = nodes ;
    this.updateGraph() ;
    this.setState(newState, callback) ;
  }

  handleNodeClick = (node:any) => {
    this.setState({ selectedUser: node }) ;
  }

  startTimeTravel = () => {
    if (this.state.ts < this.state.maxTS) {
      this.setState({ timeTravel: true }, this.continueTimeTravel) ;
    }
  }

  stopTimeTravel = () => {
    this.setState({ timeTravel: false }) ;
  }

  continueTimeTravel = () => {
    let self = this ;
    if (!self.state.timeTravel) {
      return ;
    }
    const data:any = self.props.data ;
    const currentLinks = self.links.length ;
    const totalLinks = data.links.length ;
    if (currentLinks === (totalLinks-1)) {
      self.setTimestamp(self.state.maxTS, null) ;
      self.setState({ timeTravel: false }) ;
    } else {
      self.setTimestamp(data.links[currentLinks].ts, () => {
        setTimeout(self.continueTimeTravel, TIME_TRAVEL_STEP_MS);
      }) ;
    }
  }

  renderSlider() {
    if (this.state.ts === 0) {
      return null ;
    }
    return (
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2} width='800px'>
              {timestampYYYY_MM_DD(this.state.minTS)}
              <Slider
                sx={{ width: '400px' }}
                min={this.state.minTS}
                max={this.state.maxTS}
                value={this.state.ts}
                onChange={this.handleSliderChange}
                valueLabelDisplay="on"
                valueLabelFormat={timestampYYYY_MM_DD}
                disabled={this.state.timeTravel}
              />
              {timestampYYYY_MM_DD(this.state.maxTS)}
              {this.renderTimeTravelButton()}
            </Box>
    ) ;
  }

  renderTimeTravelButton() {
    if (this.state.timeTravel) {
      return <IconButton onClick={this.stopTimeTravel} >
        <PauseIcon />
      </IconButton>
    }
    return <IconButton onClick={this.startTimeTravel} >
      <PlayArrowIcon />
    </IconButton>
  }

  renderUserFeatures() {
    const user:any = this.state.selectedUser ;
    if (!user || !user.features) {
      return null ;
    }
    const features = user.features ;
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Followers</TableCell>
            <TableCell>{features.followers_num}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Following</TableCell>
            <TableCell>{features.following_num}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ) ;
  }

  renderUserWordCloud() {
    const user:any = this.state.selectedUser ;
    if (!user || !user.features || !user.features.words_dict) {
      return null ;
    }
    const words = parseWordDict(user.features.words_dict, 15, 150)  ;
    if (!words) {
      return null ;
    }
    return (
      <WordCloud data={words}
          width={500} 
          height={500} 
          fontSize={(word:any)=>word.value}
          rotate={(word:any)=>0}
          padding={4}/>
    ) ;
  }

  renderInfos() {
    if (this.state.num_users === 0) {
      return null ;
    }
    return (
      <React.Fragment>
        <Typography variant="h6">Network</Typography>
        <hr/>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Num users</TableCell>
              <TableCell>{this.state.num_users}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Num links</TableCell>
              <TableCell>{this.state.num_links}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Connectivity</TableCell>
              <TableCell>{this.state.connectivity.toFixed(2)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br/><br/>
        {this.renderSelectedUser()}
      </React.Fragment>
    ) ;
  }

  renderSelectedUser() {
    const user:any = this.state.selectedUser ;
    if (!user) {
      return null ;
    }
    return <React.Fragment>
      <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={user.name} src={user.pfp} />
          <Typography variant="h6">{user.name}</Typography>
        </Stack>
      <hr/>
      {this.renderUserFeatures()}
      <br/>
      {this.renderUserWordCloud()}
    </React.Fragment>
  }

  renderLoading() {
    if (this.props.loading) {
      return <Loading /> ;
    }
  }

  render() {
    return (
      <Panel title='Network Visualization'>
        <Grid container>
          <Grid item xs={12} md={9}>
            {this.renderLoading()}
            {this.renderSlider()}
            <svg ref={this.graphRef} width={SIMULATION_WIDTH} height={SIMULATION_HEIGHT}></svg>
          </Grid>
          <Grid item xs={12} md={3}>
            {this.renderInfos()}
          </Grid>
        </Grid>
      </Panel>
    );
  }

}

export default NetworkShow;