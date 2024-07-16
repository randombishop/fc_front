import React from 'react';
import { Grid, Paper } from '@mui/material';

class Dashboard extends React.Component {
  render() {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((value) => (
          <Grid item xs={12} md={6} key={value}>
            <Paper style={{ height: '200px' }} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default Dashboard;
