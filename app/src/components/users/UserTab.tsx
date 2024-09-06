import React from 'react';
import { Grid } from '@mui/material';
import UserProfile from './UserProfile';


class UserTab extends React.Component< {data: any}> {
  

  renderProfile() {
    const data = this.props.data ;
    if (!data || !data.info) {
      return null ;
    }
    const info = data.info ;
    return (
      <Grid item xs={6} >
        <UserProfile name={info.display_name} avatar={info.pfp.url} />
      </Grid>
    );
  }

  renderRaw() {
    return (
      <Grid item xs={6} >
        {JSON.stringify(this.props.data)}
      </Grid>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderProfile()}
        {this.renderRaw()}
      </React.Fragment>
    );
  }

}

export default UserTab;