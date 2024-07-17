import React from 'react';
import { Grid } from '@mui/material';
import Activity from './Activity';


class Dashboard extends React.Component {

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} >
            <Activity />
        </Grid>
      </Grid>
    );
  }

}

export default Dashboard;
