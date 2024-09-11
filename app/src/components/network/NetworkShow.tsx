import React, {createRef} from 'react';
import { Grid, Box, Slider, Table, TableBody, TableCell, TableRow, Typography, Stack, Avatar, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { TextureLoader, SRGBColorSpace, SpriteMaterial, Sprite } from 'three';
import { ForceGraph3D } from 'react-force-graph';
import WordCloud from 'react-d3-cloud';
import Panel from '../common/Panel';
import Loading from '../common/Loading';
import { getBackendUrl, timestampYYYY_MM_DD, parseWordDict } from '../../utils';

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


class NetworkShow extends React.Component< {data: any, loading: boolean}> {
  
  fgRef:any = createRef();

  state = {
    data: null,
    nodeMap: {},
    ts: 0,
    minTS: 0,
    maxTS: 0,
    nodes: [],
    links: [],
    num_users: 0,
    num_links: 0,
    connectivity: 0,
    selectedUser: null,
    timeTravel: false
  }

  componentDidMount() {
    this.handleNewData() ;
  }

  componentDidUpdate(prevProps:any) {
    if (prevProps.data !== this.props.data) {
      this.handleNewData() ;
    }
  }

  handleNewData() {
    const data = this.props.data ;
    if (!data || !data.nodes || !data.links) {
      const defaultState = {
        data: null,
        ts: 0,
        minTS: 0,
        maxTS: 0,
        nodeMap: {},
        nodes: [],
        links: [],
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
    const initialState = {
      data: data,
      nodeMap: nodeMap,
      ts: minTS,
      minTS: minTS,
      maxTS: maxTS,
      nodes: nodes2,
      links: links2,
      num_users: nodes2.length,
      num_links: links2.length,
      connectivity: getConnectivity(nodes.length, links2.length)
    }
    this.setState(initialState, this.zoomToFit) ;
  }

  handleSliderChange = (event:any, value:any) => {
    const ts = value ;
    this.setTimestamp(ts, this.zoomToFit) ;
  }

  setTimestamp(ts:number, callback:any) {
    const data:any = this.state.data ;
    let links:any[] = this.state.links ;
    const previousLinkCount = links.length ;
    const nextLinkCount = findMaxIndex(data.links, ts) + 1 ;
    let nodes:any[] = this.state.nodes ;
    const nodeMap:any = this.state.nodeMap ;
    const addedNodes:any = {} ;
    for (const node of nodes) {
      addedNodes[node.id] = true ;
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
            id: nodeMap[newLink.source].id,
            name: nodeMap[newLink.source].name,
            pfp: nodeMap[newLink.source].pfp,
            features: nodeMap[newLink.source].features
          }
          nodes.push(n) ;
          addedNodes[newLink.source] = true ;
        }
        if (!addedNodes[newLink.target]) {
          const n = {
            id: nodeMap[newLink.target].id,
            name: nodeMap[newLink.target].name,
            pfp: nodeMap[newLink.target].pfp,
            features: nodeMap[newLink.target].features
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
      data: data,
      ts: ts,
      nodes: nodes,
      links: links,
      num_users: nodes.length,
      num_links: links.length,
      connectivity: getConnectivity(nodes.length, links.length)
    }
    this.setState(newState, callback) ;
  }

  handleNodeClick = (node:any) => {
    this.setState({ selectedUser: node }) ;
  }

  startTimeTravel = () => {
    let self = this ;
    if (this.state.ts < this.state.maxTS) {
      self.setState({ timeTravel: true }, self.continueTimeTravel) ;
    }
  }

  stopTimeTravel = () => {
    this.setState({ timeTravel: false }) ;
  }

  continueTimeTravel = () => {
    if (!this.state.timeTravel) {
      return ;
    }
    let self = this ;
    const data:any = self.state.data ;
    const currentLinks = self.state.links.length ;
    const totalLinks = data.links.length ;
    if (currentLinks === (totalLinks-1)) {
      self.setTimestamp(self.state.maxTS, () => {
        self.zoomToFit() ;
      }) ;
      self.setState({ timeTravel: false }) ;
    } else {
      self.setTimestamp(data.links[currentLinks].ts, () => {
        self.zoomToFit() ;
        setTimeout(self.continueTimeTravel, TIME_TRAVEL_STEP_MS);
      }) ;
    }
  }

  zoomToFit = () => { 
    if (!this.fgRef.current) {
      return ;
    }
    const fg = this.fgRef.current ;
    fg.zoomToFit(TIME_TRAVEL_STEP_MS) ;
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

  render() {
    if (this.props.loading) {
      return <Loading /> ;
    }
    if (!this.state.data) {
      return null ;
    }
    const data = { nodes: this.state.nodes, links: this.state.links } ;
    const defaultAvatar = '/avatar_empty.png'
    const nodeObject = (node:any) => {
      const url = node.pfp ? getBackendUrl() + '/avatars/transform.png?url=' + node.pfp : defaultAvatar ;
      const imgTexture = new TextureLoader().load(url);
      imgTexture.colorSpace = SRGBColorSpace;
      const material = new SpriteMaterial({ map: imgTexture });
      const sprite = new Sprite(material);
      sprite.scale.set(12, 12, 12);
      return sprite;
    }
    return (
      <Panel title='Network Visualization' backgroundColor="#000011">
        <Grid container>
          <Grid item xs={9}>
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
            <ForceGraph3D 
              ref={this.fgRef}
              graphData={data} 
              width={700} height={700} 
              nodeLabel="name"
              nodeThreeObject={nodeObject}
              nodeRelSize={12}
              linkCurvature={0.25}
              onNodeClick={this.handleNodeClick}
            />
          </Grid>
          <Grid item xs={3}>
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
          </Grid>
        </Grid>
      </Panel>
    );
  }

}

export default NetworkShow;