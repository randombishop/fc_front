import React from 'react';
import { Paper, Grid, Typography, Button } from '@mui/material';


class DailyDigest extends React.Component {
  state = {
    selectedDate: new Date(),
  };

  handleDateChange = (date: any) => {
    this.setState({ selectedDate: date });
  };

  render() {
    return (
      
        <Grid container spacing={3}>
          <Grid item xs={12}>   
          </Grid>
          {[1, 2, 3].map((topic) => (
            <Grid item xs={12} key={topic}>
              <Paper style={{ padding: '10px' }}>
                <Typography variant="h6">Topic {topic}</Typography>
                <Typography variant="body1">Summary of topic {topic}</Typography>
                <Button href="#">Social Media Post 1</Button>
                <Button href="#">Social Media Post 2</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
    );
  }
}

export default DailyDigest;
