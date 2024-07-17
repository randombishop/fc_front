import React from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';

class LikeMeter extends React.Component {
  state = {
    text: '',
    score: null,
  };

  handleChange = (event: any) => {
    this.setState({ text: event.target.value });
  };

  handleScore = () => {
    // Dummy score calculation
    const score = Math.floor(Math.random() * 100);
    this.setState({ score });
  };

  render() {
    return (
      <div>
        <TextField
          label="Enter text"
          value={this.state.text}
          onChange={this.handleChange}
          fullWidth
        />
        <Button onClick={this.handleScore} fullWidth style={{ marginTop: '10px' }}>
          Score
        </Button>
        {this.state.score !== null && (
          <Paper style={{ marginTop: '20px', padding: '20px' }}>
            <Typography variant="h4">Score: {this.state.score}</Typography>
            <img
              src={`https://dummyimage.com/600x400/000/fff&text=Score+${this.state.score}`}
              alt="Explanation"
              style={{ width: '100%' }}
            />
          </Paper>
        )}
      </div>
    );
  }
}

export default LikeMeter;
