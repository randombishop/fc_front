import React from 'react';
import { Grid, TextField, Button } from '@mui/material';


class LikeMeter extends React.Component {
  
  state = {
    text: ''
  };

  handleTextChange = (event: any) => {
    this.setState({ text: event.target.value });
  };

  score = () => {
    
  };

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
