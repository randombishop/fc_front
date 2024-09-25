import React from 'react';
import { Grid } from '@mui/material';


class MiniGridItem extends React.Component<{children:any}> {
  
  render() {
    return (
      <Grid item xs={12} md={2} lg={1} display='flex' justifyContent='center' alignItems='center' >
          {this.props.children}
      </Grid>
    );
  }
}

export default MiniGridItem;
