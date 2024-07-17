import React from 'react';
import { Grid } from '@mui/material';
import Activity from './Activity';
import Sentiment from './Sentiment';


class Dashboard extends React.Component {

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} >
            <Activity />
        </Grid>
        <Grid item xs={12} md={6} >
            <Sentiment />
        </Grid>
      </Grid>
    );
  }

}

export default Dashboard;
