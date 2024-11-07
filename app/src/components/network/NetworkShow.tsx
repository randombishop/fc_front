import React, { createRef } from 'react';
import { Grid, Box, Slider, Table, TableBody, TableCell, TableRow, 
         Typography, Stack, Avatar, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close' ;
import CompareArrowsIcon from '@mui/icons-material/CompareArrows' ;
import ArrowBackIcon from '@mui/icons-material/ArrowBack' ;
import ArrowForwardIcon from '@mui/icons-material/ArrowForward' ;
import RemoveIcon from '@mui/icons-material/Remove' ;
import HelpOutlineIcon from '@mui/icons-material/HelpOutline' ;
import * as d3 from 'd3';
import MemoWordCloud from '../common/MemoWordCloud';
import Panel from '../common/Panel';
import Loading from '../common/Loading';
import Heatmap from '../common/Heatmap';
import { timestampYYYY_MM_DD, parseWordDict, colors, findMaxIndex, 
         getRandomPoint, getLinkStats, getLinkDirection, getLinkType, shortestPaths } from '../../utils';


const TIME_TRAVEL_STEP = 5 ;
const TIME_TRAVEL_STEP_MS = 100 ;
const SIMULATION_WIDTH = 700 ;
const SIMULATION_HEIGHT = 700 ;
const NODE_RAY = 16 ;
const ZOOM_MIN = 0.1 ;
const ZOOM_MAX = 10 ;
const DEFAULT_AVATAR = '/avatar_empty.png' ;
const DEFAULT_DISTANCE = 100 ;
const LINK_DISTANCES:any = {
  0: DEFAULT_DISTANCE*2,
  1: DEFAULT_DISTANCE,
  2: DEFAULT_DISTANCE/2
}
const DEFAULT_STATE = {
  timeline: [],
  tsIndex: 0,
  numUsers: 0,
  numLinks: 0,
  selectedUser: null,
  shortestPathsMatrix: null,
  linksType0: 0,
  linksType1: 0,
  linksType2: 0,
  maxDist: null,
  avgDist: null,
  prctConnected: 0
} ;






class NetworkShow extends React.Component< {data: any, loading: boolean}> {
  
  state: any;
  graphRef: React.RefObject<SVGSVGElement>;
  simulation: any;
  zoom: any;
  svgContainer: any;
  svgNode: any;
  svgLink: any;
  svgHighlight: any ;
  links: any[];
  nodes: any[];



  // -----------------------------
  // Component Lifecycle
  // -----------------------------

  constructor(props:any) {
    super(props) ;
    this.state  = DEFAULT_STATE ;
    this.graphRef = createRef();
    this.simulation = d3.forceSimulation()
      .velocityDecay(0.8)
      .force('link', d3.forceLink()
        .id((d:any) => (d.id))
        .distance((l:any) => (LINK_DISTANCES[l.info.type])))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(SIMULATION_WIDTH / 2, SIMULATION_HEIGHT / 2))
      .force('radial', d3.forceRadial(50, SIMULATION_WIDTH / 2, SIMULATION_HEIGHT / 2));
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
    // Init layer used to highlight selections
    this.svgHighlight = this.svgContainer.append('g')
        .attr('class', 'highlight')
        .append('circle') 
    console.log('created graph') ;
  }

  handleZoom = (event:any) => {
    this.svgContainer.attr('transform', event.transform); 
  }

  updateGraph() {
    const selectedUser = this.state.selectedUser ;
    if (selectedUser) {
      // Make only selected node and connections visible
      const nodeMap:any = {} ;
      for (const n of this.nodes) {
        nodeMap[n.id] = n ;
        nodeMap[n.id].zoom = false ;
        nodeMap[n.id].alpha = 0.25 ;
      }
      for (const l of this.links) {
        const source = l.source.id?l.source.id:l.source ;
        const target = l.target.id?l.target.id:l.target ;
        l.visible = (source===selectedUser.id) || (target===selectedUser.id) ;
        if (l.visible) {
          nodeMap[source].zoom = true ;
          nodeMap[target].zoom = true ;
          nodeMap[source].alpha = 1 ;
          nodeMap[target].alpha = 1 ;
        }
      }
    } else {
      // Make everything visible
      for (const l of this.links) {
        l.visible = true ;
      }
      for (const n of this.nodes) {
        n.alpha = 1 ;
        n.zoom = true ;
      }
    }
    // Update the links
    this.svgLink = this.svgLink.data(this.links)
      .join('line')
      .attr('stroke', this.getLinkColor)
      .attr('stroke-width', this.getLinkWidth)
      .attr('stroke-dasharray', this.getLinkDashArray)
      .attr('visibility', (l:any)=>(l.visible?'show':'hidden')) ;
    this.makeLinksInteractive() ;
     
    // Update the nodes
    this.svgNode = this.svgNode.data(this.nodes)
      .join('image')
      .attr('xlink:href', (d:any) => (d.pfp ? d.pfp : DEFAULT_AVATAR))
      .attr('width', NODE_RAY*2)
      .attr('height', NODE_RAY*2)
      .attr('x', -NODE_RAY) 
      .attr('y', -NODE_RAY) 
      .attr('clip-path', 'circle(' + NODE_RAY + ')')
      .style('opacity', (d:any) => (d.alpha))
      .call(d3.drag().on('start', this.onDragStart).on('drag', this.onDragged).on('end', this.onDragEnd)) ;
    this.makeNodesInteractive() ;

    // Update the highlight
    this.svgHighlight
      .style('fill', 'none') 
      .style('stroke', colors.primary) 
      .style('stroke-width', '2px') 
      .attr('r', NODE_RAY) 
      .attr('visibility', selectedUser?'show':'hidden') ;
    // Restart the simulation with the updated nodes and links
    this.simulation.nodes(this.nodes).on('tick', this.ticked);
    this.simulation.force('link').links(this.links);
    this.simulation.alpha(1).restart();
  }

  makeLinksInteractive() {
    this.svgLink.on('mouseover', (event:any, d:any) => {
      d3.select(event.currentTarget)
        .attr('stroke', colors.primary)
        .style('cursor', 'pointer')
    })
    this.svgLink.on('mouseout', (event:any, d:any) => {
      d3.select(event.currentTarget)
      .attr('stroke', this.getLinkColor(d)) 
      .style('cursor', 'default')
    })
    this.svgLink.on('click', this.setSelectedLink);
  }

  makeNodesInteractive() {
    this.svgNode.on('mouseover', (event:any, d:any) => {
      d3.select(event.currentTarget).style('cursor', 'pointer')
    })
    this.svgNode.on('mouseout', (event:any, d:any) => {
      d3.select(event.currentTarget).style('cursor', 'default')
    })
    this.svgNode.on('click', this.setSelectedUser);
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
    this.svgHighlight
      .attr('cx', this.state.selectedUser ? this.state.selectedUser.x : 0)
      .attr('cy', this.state.selectedUser ? this.state.selectedUser.y : 0)
    this.autozoom() ;
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
    let visibleNodes = this.state.selectedUser?this.nodes.filter((n:any)=>(n.zoom)):this.nodes ;
    visibleNodes = visibleNodes.filter((n:any)=>(n.x && n.y)) ;
    if (visibleNodes.length === 0) {
      return ;
    }
    let minX = Math.min(...visibleNodes.map((n:any)=>(n.x))) ;
    let maxX = Math.max(...visibleNodes.map((n:any)=>(n.x))) ;
    let minY = Math.min(...visibleNodes.map((n:any)=>(n.y))) ;
    let maxY = Math.max(...visibleNodes.map((n:any)=>(n.y))) ;
    let bboxWidth = maxX - minX ;
    let bboxHeight = maxY - minY ;
    const padding = 50;
    const width = (2 * padding) + bboxWidth;
    const height = (2 * padding) + bboxHeight;
    const midX = minX + (width / 2) - padding;
    const midY = minY + (height / 2) - padding;
    let scale = Math.min(
      SIMULATION_WIDTH / width,
      SIMULATION_HEIGHT / height
    );
    if (scale>ZOOM_MAX) {
      scale = ZOOM_MAX ;
    } else if (scale<ZOOM_MIN) {
      scale = ZOOM_MIN ;
    }
    //svg.transition().duration(TIME_TRAVEL_STEP_MS).call()
    svg.call(
        this.zoom.transform,
        d3.zoomIdentity
          .translate(SIMULATION_WIDTH / 2, SIMULATION_HEIGHT / 2)
          .scale(scale)
          .translate(-midX, -midY) 
      );
  }

  getLinkColor = (link:any) => {
    if (link===this.state.selectedLink) {
      return colors.primary ;
    }
    const linkType = link.info.type ;
    if (linkType === 2) {
      return '#b56576' ;
    } else if (linkType === 1) {
      return '#6d597a' ; 
    } else {
      return '#355070' ;
    }
  }

  getLinkWidth = (link:any) => {
    const base = this.state.selectedUser?3:1 ;
    const linkType = link.info.type ;
    if (linkType === 2) {
      return 1.5 * base ;
    } else if (linkType === 1) {
      return base; 
    } else {
      return base/2 ;
    }
  }

  getLinkDashArray = (link:any) => {
    const linkType = link.info.type ;
    if (linkType === 2) {
      return 'none' ;
    } else if (linkType === 1) {
      return 'none' ; 
    } else {
      return '10,2' ;
    }
  }



  // ------------------------ 
  // REACT COMPONENT LOGIC
  // ------------------------

  handleNewData() {
    const data = this.props.data ;
    if (!data || !data.nodes || !data.links) {
      this.nodes = [] ;
      this.links = [] ;
      this.updateGraph() ;
      this.setState(DEFAULT_STATE) ;
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
    const timeline = links.slice(initialLinks).map((l:any) => (l.ts)) ;
    const links2:any = [] ;
    for (let i = 0; i < initialLinks; i++) {
      const l = {
        source: links[i].source,
        target: links[i].target,
        info: links[i]
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
    this.links = links2 ;
    this.nodes = nodes2 ;  
    const shortestPathsMatrix = shortestPaths(nodes2, links2) ;
    const linkStats = getLinkStats(links2, shortestPathsMatrix) ;
    const newState = {
      timeline: timeline,
      tsIndex: 0,
      numUsers: nodes2.length,
      numLinks: links2.length,
      selectedUser: null,
      shortestPathsMatrix: shortestPathsMatrix,
      linksType0: linkStats.prct0,
      linksType1: linkStats.prct1,
      linksType2: linkStats.prct2,
      maxDist: linkStats.maxDist,
      avgDist: linkStats.avgDist,
      prctConnected: linkStats.prctConnected
    }
    this.setState(newState, this.updateGraph) ;
  }

  setSelectedUser = (event: any, d: any) => {
    event.stopPropagation();  
    const newState = {
      selectedUser: d,
      selectedLink: null
    }
    this.setState(newState, () => {
      this.updateGraph() ;
    });
  } ;

  removeSelectedUser = () => {
    const newState = {
      selectedUser: null,
      selectedLink: null
    }
    this.setState(newState, () => {
      this.updateGraph() ;
      this.autozoom() ;
    });
  }

  setSelectedLink = (event: any, l: any) => {
    event.stopPropagation();    
    const newState = {
      selectedLink: l
    }
    this.setState(newState, () => {
      this.updateGraph() ;
    });
  } ;

  removeSelectedLink = () => {
    const newState = {
      selectedLink: null
    }
    this.setState(newState, () => {
      this.updateGraph() ;
    });
  }

  handleSliderChange = (event:any, value:any) => {
    const tsIndex = value ;
    this.setTimestampIndex(tsIndex, null) ;
  }

  setTimestampIndex(tsIndex:number, callback:any) {
    const ts = this.state.timeline[tsIndex] ;
    const data:any = this.props.data ;
    const previousLinkCount = this.links.length ;
    const nextLinkCount = findMaxIndex(data.links, ts) + 1 ;
    let links:any[] = this.links ;
    let nodes:any[] = this.nodes ;
    const addedNodes:any = {} ;
    let xDefault = 0 ;
    let yDefault = 0 ;
    for (const node of nodes) {
      addedNodes[node.id] = node ;
      xDefault += node.x ;
      yDefault += node.y ;
    }
    xDefault /= nodes.length ;
    yDefault /= nodes.length ;
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
          target: data.links[i].target,
          info: data.links[i]
        }
        links.push(newLink) ;
        let x0 = xDefault ;
        let y0 = yDefault ;
        if (addedNodes[newLink.source]) {
          x0 = addedNodes[newLink.source].x ;
          y0 = addedNodes[newLink.source].y ;
        } else if (addedNodes[newLink.target]) {
          x0 = addedNodes[newLink.target].x ;
          y0 = addedNodes[newLink.target].y ;
        }
        const p = getRandomPoint(x0, y0, DEFAULT_DISTANCE) ;
        x0 = p.x ;
        y0 = p.y ;
        if (!addedNodes[newLink.source]) {
          const n = {
            id: missingNodes[newLink.source].id,
            name: missingNodes[newLink.source].name,
            pfp: missingNodes[newLink.source].pfp,
            features: missingNodes[newLink.source].features,
            x: x0,
            y: y0
          }
          nodes.push(n) ;
          addedNodes[newLink.source] = true ;
        }
        if (!addedNodes[newLink.target]) {
          const n = {
            id: missingNodes[newLink.target].id,
            name: missingNodes[newLink.target].name,
            pfp: missingNodes[newLink.target].pfp,
            features: missingNodes[newLink.target].features,
            x: x0,
            y: y0
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
          target: data.links[i].target,
          info: data.links[i]
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
    this.links = links ;
    this.nodes = nodes ;
    const shortestPathsMatrix = shortestPaths(nodes, links) ;
    const linkStats = getLinkStats(links, shortestPathsMatrix) ;
    const newState = {
      tsIndex: tsIndex,
      numUsers: nodes.length,
      numLinks: links.length,
      shortestPathsMatrix: shortestPathsMatrix,
      linksType0: linkStats.prct0,
      linksType1: linkStats.prct1,
      linksType2: linkStats.prct2,
      maxDist: linkStats.maxDist,
      avgDist: linkStats.avgDist,
      prctConnected: linkStats.prctConnected
    }
    this.setState(newState, () => {
      this.updateGraph() ;
      if (callback) {
        callback() ;
      }
    }) ;
  }

  startTimeTravel = () => {
    if (this.state.tsIndex < this.state.timeline.length) {
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
    if (this.state.tsIndex >= (self.state.timeline.length-(TIME_TRAVEL_STEP+1))) {
      self.setTimestampIndex(self.state.timeline.length-1, null) ;
      self.setState({ timeTravel: false }) ;
    } else {
      self.setTimestampIndex(self.state.tsIndex+TIME_TRAVEL_STEP, () => {
        setTimeout(self.continueTimeTravel, TIME_TRAVEL_STEP_MS);
      }) ;
    }
  }







  // -------------------------- 
  // REACT COMPONENT RENDERING
  // --------------------------

  renderSlider() {
    if (this.state.timeline.length === 0) {
      return null ;
    }
    return (
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
        {timestampYYYY_MM_DD(this.state.timeline[0])}
        <Slider
          sx={{ width: '300px' }}
          min={0}
          max={this.state.timeline.length-1}
          value={this.state.tsIndex}
          onChange={this.handleSliderChange}
          valueLabelDisplay="on"
          valueLabelFormat={(v:number) => (timestampYYYY_MM_DD(this.state.timeline[v]))}
          disabled={this.state.timeTravel}
        />
        {timestampYYYY_MM_DD(this.state.timeline[this.state.timeline.length-1])}
        {this.renderTimeTravelButton()}
      </Box>
    ) ;
  }

  renderTimeTravelButton() {
    if (this.state.timeTravel) {
      return <IconButton onClick={this.stopTimeTravel} >
        <PauseIcon />
      </IconButton>
    } else {
      return <IconButton onClick={this.startTimeTravel} >
        <PlayArrowIcon />
      </IconButton>
    }
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
            <TableCell>{features.follower_num}</TableCell>
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
      <MemoWordCloud 
        fid={user.id}
        data={words}
        width={500} 
        height={500} 
          fontSize={(word:any)=>word.value}
          rotate={(word:any)=>0}
          padding={4}/>
    ) ;
  }

  renderNetworkInfo() {
    if (this.state.numUsers === 0) {
      return null ;
    }
    return (
      <React.Fragment>
        <Typography variant="h6">Network</Typography>
        <hr/>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Users</TableCell>
              <TableCell>{this.state.numUsers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Links</TableCell>
              <TableCell>{this.state.numLinks}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mutuals</TableCell>
              <TableCell>{this.state.linksType2.toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>One-way</TableCell>
              <TableCell>{this.state.linksType1.toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Reactions-only</TableCell>
              <TableCell>{this.state.linksType0.toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Shortest Path<br/>
                <Tooltip title="Using only follow links, and ignoring infinite distances (disconnected pairs)">
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip>
              </TableCell>
              <TableCell>Avg: {this.state.avgDist.toFixed(1)}<br/>Max: {this.state.maxDist}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Follow chains</TableCell>
              <TableCell>{this.state.prctConnected.toFixed(1)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br/>
        <Typography variant="body1">Shortest Path Matrix</Typography>
        <Heatmap width={200} height={200}
                 matrix={this.state.shortestPathsMatrix} maxDistance={this.state.maxDist} />
      </React.Fragment>
    ) ;
  }

  renderUserInfo() {
    const user:any = this.state.selectedUser ;
    if (!user) {
      return null ;
    }
    let name = user.name ;
    if (!name || name.length===0) {
      name = '#' + user.id ;
    }
    return <React.Fragment>
      <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={name} src={user.pfp} />
          <Typography variant="h6">{name}</Typography>
          <IconButton onClick={this.removeSelectedUser}>
            <CloseIcon />
          </IconButton>
        </Stack>
      <hr/>
      {this.renderUserFeatures()}
      <br/>
      {this.renderUserWordCloud()}
    </React.Fragment>
  }

  renderLinkArrow(linkType:string) {
    if (linkType === '2way') {
      return <CompareArrowsIcon /> ;
    } else if (linkType === '1wayLeft') {
      return <ArrowBackIcon /> ;
    } else if (linkType === '1wayRight') {
      return <ArrowForwardIcon /> ;
    } else {
      return <RemoveIcon /> ;
    }
  } 

  renderArrow(direction:string) {
    if (direction === 'left') {
      return <ArrowBackIcon /> ;
    } else if (direction === 'right') {
      return <ArrowForwardIcon /> ;
    } else {
      return null ;
    }
  } 

  renderLinkTable(direction:string ,link:any) {
    return (
       <Table>
          <TableBody>
            <TableRow>
              <TableCell>{this.renderArrow(direction)}</TableCell>
              <TableCell> </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{direction==='right'?'Follows':'Follows back'}</TableCell>
              <TableCell>{link.follow?'Yes':'No'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Recasts</TableCell>
              <TableCell>{link.recasts}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Likes</TableCell>
              <TableCell>{link.likes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Replies</TableCell>
              <TableCell>{link.replies}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
    )
  }

  renderLinkInfo() {
    const link:any = this.state.selectedLink ;
    if (!link) {
      return null ;
    }
    const isSource = this.state.selectedUser ? link.source.id === this.state.selectedUser.id : false ;
    const source = isSource?link.source:link.target ;
    const target = isSource?link.target:link.source ;
    const link1 = isSource?getLinkDirection(link, 1):getLinkDirection(link, 2) ;
    const link2 = isSource?getLinkDirection(link, 2):getLinkDirection(link, 1) ;
    const linkType = getLinkType(link1, link2) ;    
    return <React.Fragment>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt={source.name} src={source.pfp} />
        {this.renderLinkArrow(linkType)}
        <Avatar alt={target.name} src={target.pfp} />
        <IconButton onClick={this.removeSelectedLink}>
          <CloseIcon />
        </IconButton>
        </Stack>
      <hr/>
      {this.renderLinkTable('right', link1)}
      <hr/>
      {this.renderLinkTable('left', link2)}
    </React.Fragment>
  }

  renderInfos() {
    if (this.state.selectedLink) {
      return this.renderLinkInfo() ;
    } else if (this.state.selectedUser) {
      return this.renderUserInfo() ;
    } else if (this.state.numUsers>0) {
      return this.renderNetworkInfo() ;
    } else {
      return null ;
    }
  }

  renderLoading() {
    if (this.props.loading) {
      return <Loading /> ;
    }
  }

  render() {
    return (
      <Panel title='Network Visualization'>
        {this.renderLoading()}
        <Grid container>
          <Grid item md={12} lg={9}>
            {this.renderSlider()}
            <Box sx={{width: SIMULATION_WIDTH, height: SIMULATION_HEIGHT}}>
              <svg ref={this.graphRef} width={SIMULATION_WIDTH} height={SIMULATION_HEIGHT}></svg>
            </Box>
          </Grid>
          <Grid item md={12} lg={3}>
            {this.renderInfos()}
          </Grid>
        </Grid>
      </Panel>
    );
  }

}

export default NetworkShow;