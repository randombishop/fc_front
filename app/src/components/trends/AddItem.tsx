import React from 'react';
import { Grid, FormControl, TextField, Select, MenuItem, Button } from '@mui/material';
import { castCategories, castTopics, featureTranslation } from '../../utils';
import { AppContext } from '../../AppContext';


class AddItem extends React.Component<{add: (item: string) => void}> {
  
  static contextType = AppContext ;

  state = {
    type: 'c',
    category: 'c_arts',
    topic: 't_music',
    keyword: '',
    feature: 'q_clear',
    feature_value: '1',
    channel: '_null_',
    username: '',
    channels: []
  };

  componentDidMount() {
    this.loadChannels() ;
  }

  loadChannels() {
    const context:any = this.context ;
    context.backendGET('/channels/list', (data: any) => {
      this.setState({ channels: data });
    });
  }

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

  handleUsernameChange = (event: any) => {
    this.setState({ username: event.target.value });
  };

  addItem = () => {
    const context:any = this.context ;
    if (this.state.type === 'c') {
      this.props.add(this.state.category)
    } else if (this.state.type === 't') {
      this.props.add(this.state.topic)
    } else if (this.state.type === 'q') {
      this.props.add(this.state.feature+'_'+this.state.feature_value)
    } else if (this.state.type === 'k') {
      let item = this.state.keyword ;
      if (item.length<3) {
        context.newAlert({type: 'error', message: 'Invalid keyword, must be at least 3 characters'}) ;
      } else {
        this.props.add('k_'+item) ;
      }
    } else if (this.state.type === 'p') {
      this.props.add('p_'+this.state.channel)
    } else if (this.state.type === 'u') {
      this.props.add('u_'+this.state.username)
    } else {
      context.newAlert({type: 'error', message: 'Invalid type'});
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
            <MenuItem value="u">From user</MenuItem>
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
    } else if (type === 'u') {
      return  (<React.Fragment>
        {this.renderStepFromUser()}
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
    const channels = this.state.channels ;
    const rows = channels.sort((a:any, b:any) => a.name.localeCompare(b.name))
    return (
      <Grid item>
        <FormControl>
          <Select value={this.state.channel} onChange={this.handleChannelChange}>
            <MenuItem value="_null_">---No Channel---</MenuItem>
            <MenuItem value="_any_">---Any Channel---</MenuItem>
            {rows.map((channel:any) => (
              <MenuItem key={channel.id} value={channel.id}>{channel.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepFromUser() {
    return (
      <Grid item>
        <TextField value={this.state.username} onChange={this.handleUsernameChange} />
      </Grid>
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
