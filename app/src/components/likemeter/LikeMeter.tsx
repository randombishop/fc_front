import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { getBackendUrl } from '../../utils';


class LikeMeter extends React.Component {
  
  state = {
    text: ''
  };

  handleTextChange = (event: any) => {
    this.setState({ text: event.target.value });
  };

  score = () => {
    const text = this.state.text;
    const post = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({text}),
    }
    fetch(`${getBackendUrl()}/predict_like/score`, post)
      .then(response => response.json())
      .then(data => this.waitForResult(data))
      .catch(error => alert('Error:' + error));
  };

  waitForResult = (data: any) => {
    console.log(data) ;
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Enter text"
            value={this.state.text}
            onChange={this.handleTextChange}
            fullWidth
          />
          <Button onClick={this.score} fullWidth style={{ marginTop: '10px' }}>
            Score
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default LikeMeter;
