import React from 'react';
import { Grid, FormControl, Select, MenuItem, Button, TextField, 
         Box, FormControlLabel, RadioGroup, Radio, Typography } from '@mui/material';
import { AppContext } from '../../AppContext';
import { castCategories } from '../../utils';


class NetworkSelect extends React.Component<{sample: string, mode: string, item: string, 
                                            selectNetwork: (sample: string, mode: string, item: string) => void,
                                            showNetwork: () => void,
                                            loading: boolean}> {
  
  static contextType = AppContext ;

  state = {
    channels: null,
    groups: null
  }

  componentDidMount() {
    this.loadChannels() ;
    this.loadGroups() ;
  }

  loadChannels() {
    const context:any = this.context ;
    context.backendGET('/channels/list', (data: any) => {
      this.setState({ channels: data });
    });
  }

  loadGroups() {
    const context:any = this.context ;
    context.backendGET('/groups/list', (data: any) => {
      this.setState({ groups: data });
    });
  }

  handleModeChange = (event: any) => {
    let mode = event.target.value ;
    let item = '' ;
    if (mode === 'group') {
      item = '1' ;
    } else if (mode === 'category') {
      item = Object.keys(castCategories)[0] ;
    } else if (mode === 'channel') {
      const channels:any = this.state.channels
      item = channels?channels[0].id:'' ;
    } 
    let sample = this.props.sample ;
    this.props.selectNetwork(sample, mode, item) ;
  }

  handleGroupChange = (event: any) => {
    let item = event.target.value ;
    let sample = this.props.sample ;
    this.props.selectNetwork(sample,'group', item) ;
  }

  handleCategoryChange = (event: any) => {
    let item = event.target.value ;
    let sample = this.props.sample ;
    this.props.selectNetwork(sample, 'category', item) ;
  }

  handleChannelChange = (event: any) => {
    let item = event.target.value ;
    let sample = this.props.sample ;
    this.props.selectNetwork(sample,'channel', item) ;
  }

  handleUserChange = (event: any) => {
    let mode = this.props.mode ;
    let item = event.target.value ;
    let sample = this.props.sample ;
    this.props.selectNetwork(sample, mode, item) ;
  }

  handleSampleChange = (event: any) => {
    let sample = event.target.value ;
    this.props.selectNetwork(sample, this.props.mode, this.props.item) ;
  }

  showNetwork = () => {
    this.props.showNetwork() ;
  } 


  renderStepIntro() {
    return (
      <Typography variant="body2">Select users from</Typography>
    );
  }

  renderStepMode() {
    return (
      <Grid item>
        <FormControl>
          <Select value={this.props.mode} onChange={this.handleModeChange}>
            <MenuItem value="group">Group</MenuItem>            
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="channel">Channel</MenuItem>
            <MenuItem value="followers_of">Followers of</MenuItem>
            <MenuItem value="followed_by">Followed by</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepGroup() {
    if (this.props.mode !== 'group' || !this.state.groups) return ;
    const groups:any = this.state.groups ;
    return (
      <Grid item>
        <FormControl>
          <Select value={this.props.item} onChange={this.handleGroupChange} >
            {groups.map((group:any) => (
              <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepCategory() {
    if (this.props.mode !== 'category') return ;
    const categories = Object.entries(castCategories) ;
    return (
      <Grid item>
        <FormControl>
          <Select value={this.props.item} onChange={this.handleCategoryChange} >
            {categories.map(([key, value]) => (
              <MenuItem key={key} value={key}>{""+value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepChannel() {
    if (this.props.mode !== 'channel' || !this.state.channels) return ;
    const channels:any = this.state.channels ;
    return (
      <Grid item>
        <FormControl>
          <Select value={this.props.item} onChange={this.handleChannelChange} >
            {channels.map((channel:any) => (
              <MenuItem key={channel.id} value={channel.id}>{channel.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepUser() {
    let userMode = this.props.mode === 'followers_of' || this.props.mode === 'followed_by' ;
    if (!userMode) return ;
    return (
      <Grid item>
        <TextField value={this.props.item} onChange={this.handleUserChange} />
      </Grid>
    );
  }

  renderStepSample() {
    return (
      <React.Fragment>
        <Typography variant="body2">When sample size is more than 250, select:</Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="sample-type"
            name="sample-type"
            value={this.props.sample}
            onChange={this.handleSampleChange}
          >
            <FormControlLabel value="random" control={<Radio />} label="Random sample" />
            <FormControlLabel value="top" control={<Radio />} label="Top Users" />
          </RadioGroup>
        </FormControl>
      </React.Fragment>
    );
  }

  renderStepSelect() {
    return (
      <Grid item sx={{display: 'flex', alignItems: 'center'}}>
        <Button variant="contained" color="primary" onClick={this.showNetwork} disabled={this.props.loading} >
          Show Network
        </Button>
      </Grid>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
          {this.renderStepIntro()}
          {this.renderStepMode()}
          {this.renderStepGroup()}
          {this.renderStepCategory()}
          {this.renderStepChannel()}
          {this.renderStepUser()}
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2} sx={{marginTop: '10px'}}>
          {this.renderStepSample()}
        </Box>        
        <Box sx={{marginTop: '10px'}}>
          {this.renderStepSelect()}
        </Box>
      </React.Fragment>
    );
  }
}

export default NetworkSelect;
