import React from 'react';
import { Grid } from '@mui/material';
import Volume from './Volume';
import Sentiment from './Sentiment';
import Quality from './Quality';
import Content from './Content';


class Dashboard extends React.Component {

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} >
            <Volume />
        </Grid>
        <Grid item xs={12} md={6} >
            <Sentiment />
        </Grid>
        <Grid item xs={12} md={6} >
            <Quality />
        </Grid>
        <Grid item xs={12} md={6} >
            <Content />
        </Grid>
      </Grid>
    );
  }

}

export default Dashboard;
