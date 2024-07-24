import React from 'react';
import 'chart.js/auto';
import { Grid } from '@mui/material';
import Panel from '../common/Panel'; 
import TrendVolumeBars from './TrendVolumeBars';
import TrendVolumeLines from './TrendVolumeLines';



class TrendVolume extends React.Component<{ items: string[], data: any }> {

  render() {
    return (
      <Panel title="Volume">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4} >
            <TrendVolumeBars items={this.props.items} data={this.props.data} />
          </Grid>
          <Grid item xs={12} md={8} >
            <TrendVolumeLines items={this.props.items} data={this.props.data} />
          </Grid>          
        </Grid>
      </Panel>
    );
  }

}

export default TrendVolume;
