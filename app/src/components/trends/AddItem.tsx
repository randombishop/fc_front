import React from 'react';
import { Grid, FormControl, TextField, Select, MenuItem, Button } from '@mui/material';
import { castCategories, castTopics, featureTranslation } from '../../utils';
import listChannels from '../data/channels.json';


class AddItem extends React.Component<{add: (item: string) => void}> {
  
  state = {
    type: 'c',
    category: 'c_arts',
    topic: 't_music',
    keyword: '',
    feature: 'q_clear',
    feature_value: '1',
    channel: 'null'
  };

  handleTypeChange = (event: any) => {
    this.setState({ type: event.target.value });
  };

  handleCategoryChange = (event: any) => {
    const c = event.target.value ;
    const t = Object.keys(castTopics[c])[0] ;
    this.setState({ category: c, topic: t });
  };

  handleTopicChange = (event: any) => {
    this.setState({ topic: event.target.value });
  };

  handleFeatureChange = (event: any) => {
    this.setState({ feature: event.target.value });
  };

  handleFeatureValueChange = (event: any) => {
    this.setState({ feature_value: event.target.value });
  };

  handleKeywordChange = (event: any) => {
    this.setState({ keyword: event.target.value });
  };

  handleChannelChange = (event: any) => {
    this.setState({ channel: event.target.value });
  };

  addItem = () => {
    if (this.state.type === 'c') {
      this.props.add(this.state.category)
    } else if (this.state.type === 't') {
      this.props.add(this.state.topic)
    } else if (this.state.type === 'q') {
      this.props.add(this.state.feature+'_'+this.state.feature_value)
    } else if (this.state.type === 'k') {
      let item = this.state.keyword ;
      if (item.length<3) {
        alert('Invalid keyword, must be at least 3 characters') ;
      } else {
        this.props.add('k_'+item) ;
      }
    } else if (this.state.type === 'p') {
      this.props.add('p_'+this.state.channel)
    } else {
      alert('Invalid type');
    }
  };

  renderStepType() {
    return (
      <Grid item>
        <FormControl>
          <Select value={this.state.type} onChange={this.handleTypeChange}>
            <MenuItem value="c">Category</MenuItem>
            <MenuItem value="t">Topic</MenuItem>
            <MenuItem value="q">Feature</MenuItem>
            <MenuItem value="k">Keyword</MenuItem>
            <MenuItem value="p">Channel</MenuItem>
            <MenuItem value="r">Replying to</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderSelection() {
    const type = this.state.type ;
    if (type === 'c') {
      return this.renderStepCategory() ;
    } else if (type === 't') {
      return (<React.Fragment>
        {this.renderStepCategory()}
        {this.renderStepTopic()}
      </React.Fragment>) ;
    } else if (type === 'q') {
      return (<React.Fragment>
        {this.renderStepFeature()}
        {this.renderStepFeatureValue()}
      </React.Fragment>) ;
    } else if (type === 'k') {
      return this.renderStepKeyword() ;
    } else if (type === 'p') {
      return (<React.Fragment>
        {this.renderStepChannel()}
      </React.Fragment>) ;
    } else if (type === 'r') {
      return  (<React.Fragment>
        {this.renderStepReplyingTo()}
      </React.Fragment>) ;
    }
  }

  renderStepCategory() {
    const categories = Object.entries(castCategories) ;
    return (
      <Grid item>
        <FormControl>
          <Select value={this.state.category} onChange={this.handleCategoryChange} >
            {categories.map(([key, value]) => (
              <MenuItem key={key} value={key}>{""+value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepTopic() {
    const category = this.state.category;
    const topics = Object.entries(castTopics[category]);
    return (
      <Grid item>
        <FormControl>
          <Select value={this.state.topic} onChange={this.handleTopicChange} >
            {topics.map(([key, value]) => (
              <MenuItem key={key} value={key}>{""+value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepFeature() {
    const features = Object.entries(featureTranslation) ;
    return (
      <Grid item>
        <FormControl>
          <Select value={this.state.feature} onChange={this.handleFeatureChange} >
            {features.map(([key, value]) => (
              <MenuItem key={key} value={key}>{""+value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepFeatureValue() {
    return (
      <Grid item>
        <FormControl>
          <Select value={this.state.feature_value} onChange={this.handleFeatureValueChange}>
            <MenuItem value="0">No</MenuItem>
            <MenuItem value="1">Yes</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepKeyword() {
    return (
      <Grid item>
        <TextField value={this.state.keyword} onChange={this.handleKeywordChange} />
      </Grid>
    );
  }

  renderStepChannel() {
    const rows = listChannels.sort((a:any, b:any) => a.name.localeCompare(b.name))
    return (
      <Grid item>
        <FormControl>
          <Select value={this.state.channel} onChange={this.handleChannelChange}>
            <MenuItem value="null">None</MenuItem>
            {rows.map((channel:any) => (
              <MenuItem key={channel.channel_id} value={channel.channel_id}>{channel.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepReplyingTo() {
    return (
      "REPLYING TO"
    );
  }

  renderStepAdd() {
    return (
      <Grid item sx={{display: 'flex', alignItems: 'center'}}>
        <Button variant="contained" color="primary" onClick={this.addItem}>
          Add Item
        </Button>
      </Grid>
    );
  }

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          {this.renderStepType()}
          {this.renderSelection()}
          {this.renderStepAdd()}
        </Grid>
      </div>
    );
  }
}

export default AddItem;
