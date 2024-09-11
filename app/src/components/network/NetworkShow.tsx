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
    const links = data.links ;
    links.sort((a:any, b:any) => a.ts - b.ts) ;
    const initialLinks = Math.floor(links.length/25) ;
    const minTS = links[initialLinks].ts ;
    const maxTS = links[links.length - 1].ts ;
    const links2 = links.slice(0,initialLinks) ;
    const initialState = {
      data: data,
      ts: minTS,
      minTS: minTS,
      maxTS: maxTS,
      nodes: nodes,
      links: links2,
      num_users: nodes.length,
      num_links: links2.length,
      connectivity: getConnectivity(nodes.length, links2.length)
    }
    this.setState(initialState) ;
  }

  handleSliderChange = (event:any, value:any) => {
    const ts = value ;
    this.setTimestamp(this.state.data, this.state.links, ts, this.zoomToFit) ;
  }

  setTimestamp(data:any, links:any[], ts:number, callback:any) {
    const previousLinkCount = links.length ;
    const nextLinkCount = findMaxIndex(data.links, ts) + 1 ;
    if (nextLinkCount > previousLinkCount) {
      links = links.slice() ;
      for (let i = previousLinkCount; i < nextLinkCount; i++) {
        const newLink = {
          source: data.links[i].source,
          target: data.links[i].target
        }
        links.push(newLink) ;
      }
    } else if (nextLinkCount < previousLinkCount) {
      console.log('removing links') ;
      links = links.slice(0, nextLinkCount) ;
    }
    const newState = {
      data: data,
      ts: ts,
      links: links,
      num_links: links.length,
      connectivity: getConnectivity(data.nodes.length, links.length)
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
      self.setTimestamp(data, self.state.links, self.state.maxTS, () => {
        self.zoomToFit() ;
      }) ;
      self.setState({ timeTravel: false }) ;
    } else {
      self.setTimestamp(data, self.state.links, data.links[currentLinks].ts, () => {
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
    fg.zoomToFit() ;
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