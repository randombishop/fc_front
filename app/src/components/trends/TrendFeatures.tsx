import React from 'react';
import 'chart.js/auto';
import { Grid } from '@mui/material';
import Panel from '../common/Panel'; 
import TrendRadar from './TrendRadar';



class TrendFeatures extends React.Component<{ items: string[], data: any }> {

  render() {
    return (
      <Panel title="Features">
        <Grid container spacing={5}>
          <Grid item md={5} >
            <TrendRadar items={this.props.items} data={this.props.data} />
          </Grid>
          <Grid item md={7} >
            table goes here
          </Grid>          
        </Grid>
      </Panel>
    );
  }

}

export default TrendFeatures ;
