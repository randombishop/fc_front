import React from 'react';
import 'chart.js/auto';
import { Grid } from '@mui/material';
import Panel from '../common/Panel'; 
import TrendFeaturesRadar from './TrendFeaturesRadar';
import TrendFeaturesTable from './TrendFeaturesTable';



class TrendFeatures extends React.Component<{ items: string[], data: any }> {

  render() {
    return (
      <Panel title="Features">
        <Grid container spacing={5}>
          <Grid item md={6} >
            <TrendFeaturesRadar items={this.props.items} data={this.props.data} />
          </Grid>
          <Grid item md={12} >
            <TrendFeaturesTable items={this.props.items} data={this.props.data} />
          </Grid>          
        </Grid>
      </Panel>
    );
  }

}

export default TrendFeatures ;
