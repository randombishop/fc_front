import React from 'react';
import { Grid, FormControl, TextField, Select, MenuItem, Button } from '@mui/material';
import { castCategories, castTopics, featureTranslation } from '../../utils';


class AddItem extends React.Component<{add: (item: string) => void}> {
  
  state = {
    type: 'c',
    category: 'c_arts',
    topic: 't_music',
    keyword: '',
    feature: 'q_clear',
    feature_value: '1'
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
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderStepCategory() {
    if (this.state.type !== 'c' && this.state.type !== 't') {
      return null;
    }
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
    if (this.state.type !== 't') {
      return null;
    }
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
    if (this.state.type !== 'q') {
      return null;
    }
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
    if (this.state.type !== 'q') {
      return null;
    }
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
    if (this.state.type !== 'k') {
      return null;
    }
    return (
      <Grid item>
        <TextField value={this.state.keyword} onChange={this.handleKeywordChange} />
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
          {this.renderStepCategory()}
          {this.renderStepTopic()}
          {this.renderStepFeature()}
          {this.renderStepFeatureValue()}
          {this.renderStepKeyword()}
          {this.renderStepAdd()}
        </Grid>
      </div>
    );
  }
}

export default AddItem;
