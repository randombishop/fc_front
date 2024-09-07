import React from 'react';
import { Grid } from '@mui/material';
import UserProfile from './UserProfile';
import Followers from './Followers';


class UserTab extends React.Component< {data: any}> {
  

  renderProfile() {
    return (
      <Grid item xs={6} >
        <UserProfile data={this.props.data} />
      </Grid>
    );
  }

  renderFollowers() {
    return (
      <Grid item xs={6} >
        <Followers data={this.props.data} />
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
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <React.Fragment>
        {this.renderProfile()}
        {this.renderFollowers()}
        {this.renderRaw()}
      </React.Fragment>
    );
  }

}

export default UserTab;