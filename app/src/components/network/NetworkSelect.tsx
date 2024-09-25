import React from 'react';
import { Grid, FormControl, Select, MenuItem, Button, TextField, 
         Box, FormControlLabel, RadioGroup, Radio, Typography } from '@mui/material';
import { AppContext } from '../../AppContext';
import { castCategories } from '../../utils';

const NUM_NODES_MAX = 100 ;

class NetworkSelect extends React.Component<{sample: string, filter: string, mode: string, item: string, 
                                            selectNetwork: (sample: string, filter: string, mode: string, item: string) => void,
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
    this.props.selectNetwork(this.props.sample, this.props.filter, mode, item) ;
  }

  handleGroupChange = (event: any) => {
    let item = event.target.value ;
    this.props.selectNetwork(this.props.sample, this.props.filter, 'group', item) ;
  }

  handleCategoryChange = (event: any) => {
    let item = event.target.value ;
    this.props.selectNetwork(this.props.sample, this.props.filter, 'category', item) ;
  }

  handleChannelChange = (event: any) => {
    let item = event.target.value ;
    this.props.selectNetwork(this.props.sample, this.props.filter, 'channel', item) ;
  }

  handleFreeTextChange = (event: any) => {
    let item = event.target.value ;
    this.props.selectNetwork(this.props.sample, this.props.filter, this.props.mode, item) ;
  }

  handleSampleChange = (event: any) => {
    let sample = event.target.value ;
    this.props.selectNetwork(sample, this.props.filter, this.props.mode, this.props.item) ;
  }

  handleFilterChange = (event: any) => {
    let filter = event.target.value ;
    this.props.selectNetwork(this.props.sample, filter, this.props.mode, this.props.item) ;
  }

  showNetwork = () => {
    this.props.showNetwork() ;
  } 

  renderStepMode() {
    return (
      <Grid item xs={12} md={6} lg={4}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
          <Typography variant="body2">Select users from</Typography>
          <FormControl fullWidth>
            <Select value={this.props.mode} onChange={this.handleModeChange}>
              <MenuItem value="group">Group</MenuItem>            
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="channel">Channel</MenuItem>
              <MenuItem value="followers_of">Followers of</MenuItem>
              <MenuItem value="followed_by">Followed by</MenuItem>
              <MenuItem value="usernames">List of usernames</MenuItem>
              <MenuItem value="fids">List of FIDs</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
    );
  }

  renderStepGroup() {
    if (this.props.mode !== 'group' || !this.state.groups) return ;
    const groups:any = this.state.groups ;
    return (
      <Grid item xs={12} md={6} lg={4}>
<FormControl fullWidth>
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
      <Grid item xs={12} md={6} lg={4}>
        <FormControl fullWidth>
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
      <Grid item xs={12} md={6} lg={4}>
        <FormControl fullWidth>
          <Select value={this.props.item} onChange={this.handleChannelChange} >
            {channels.map((channel:any) => (
              <MenuItem key={channel.id} value={channel.id}>{channel.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepFreeText() {
    let userMode = this.props.mode === 'followers_of' || this.props.mode === 'followed_by' 
                   || this.props.mode === 'usernames' || this.props.mode === 'fids' ;
    if (!userMode) return ;
    let minRows = 1;
    let maxRows = 1;
    if (this.props.mode === 'usernames' || this.props.mode === 'fids') {
      minRows = 1;
      maxRows = 10;
    }
    return (
      <Grid item xs={12} md={6} lg={6}>
        <TextField 
          fullWidth
          multiline
          minRows={minRows}
          maxRows={maxRows}
          value={this.props.item} 
          onChange={this.handleFreeTextChange} 
        />
      </Grid>
    );
  }

  renderStepSample() {
    return (
      <Grid item lg={12}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
          <Typography variant="body2">When sample size is more than {NUM_NODES_MAX}, select:</Typography>
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
        </Box>
      </Grid>
    );
  }

  renderStepFilter() {
    return (
      <Grid item lg={12}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
          <Typography variant="body2">Filter strongest connections</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="sample-type"
              name="sample-type"
              value={this.props.filter}
              onChange={this.handleFilterChange}
            >
              <FormControlLabel value="10" control={<Radio />} label="Top 10" />
              <FormControlLabel value="50" control={<Radio />} label="Top 50" />
              <FormControlLabel value="-1" control={<Radio />} label="No Filter" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>
    );
  }

  renderStepButton() {
    return (
      <Grid item lg={12}>
        <Button variant="contained" color="primary" onClick={this.showNetwork} disabled={this.props.loading} >
          Show Network
        </Button>
      </Grid>
    );
  }

  render() {
    return (
      <Grid container spacing={3}>
        {this.renderStepMode()}
        {this.renderStepGroup()}
        {this.renderStepCategory()}
        {this.renderStepChannel()}
        {this.renderStepFreeText()}
        {this.renderStepSample()}
        {this.renderStepFilter()}
        {this.renderStepButton()}
      </Grid>
    );
  }
}

export default NetworkSelect;
