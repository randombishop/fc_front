import React from 'react';
import { Grid } from '@mui/material';
import DigestCard from './DigestCard';
import DigestLinks from './DigestLinks';


class BotDigest extends React.Component<{result:any}> {
  
  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DigestCard data={this.props.result} />
        </Grid>
        <DigestLinks links={this.props.result.links} />
      </Grid>
    );
  }
  
}

export default BotDigest;
