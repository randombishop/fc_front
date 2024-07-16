import React from 'react';
import { Paper, Button, MenuItem, Select, Grid, Typography} from '@mui/material';


class Trends extends React.Component {
  state = {
    topics: [],
    selectedTopic: '',
  };

  handleChange = (event: any) => {
    this.setState({ selectedTopic: event.target.value });
  };

  addTopic = () => {
    this.setState((prevState: any) => ({
      topics: [...prevState.topics, prevState.selectedTopic],
      selectedTopic: '',
    }));
  };

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              value={this.state.selectedTopic}
              onChange={this.handleChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Select Topic</MenuItem>
              <MenuItem value="Topic 1">Topic 1</MenuItem>
              <MenuItem value="Topic 2">Topic 2</MenuItem>
              <MenuItem value="Topic 3">Topic 3</MenuItem>
            </Select>
            <Button onClick={this.addTopic} fullWidth style={{ marginTop: '10px' }}>
              Add Topic
            </Button>
          </Grid>
          {this.state.topics.map((topic, index) => (
            <Grid item xs={12} key={index}>
              <Paper style={{ height: '200px' }}>
                <Typography variant="h6">{topic}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default Trends;
