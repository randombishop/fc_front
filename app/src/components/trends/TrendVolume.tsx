import React from 'react';
import 'chart.js/auto';
import { Grid } from '@mui/material';
import Panel from '../common/Panel'; 
import TrendVolumeBars from './TrendVolumeBars';



class TrendVolume extends React.Component<{ items: string[], data: any }> {

  render() {
    return (
      <Panel title="Volume">
        <Grid container spacing={1}>
          <Grid item md={6} >
            <TrendVolumeBars items={this.props.items} data={this.props.data} />
          </Grid>
          
        </Grid>
      </Panel>
    );
  }

}

export default TrendVolume;
