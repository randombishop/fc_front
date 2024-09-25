import React from 'react';
import { Grid } from '@mui/material';
import UserProfile from './UserProfile';
import UserFollowers from './UserFollowers';
import UserCategories from './UserCategories';
import UserWordCloud from './UserWordCloud';
import UserEngagement from './UserEngagement';
import UserFollowerAnalysis from './UserFollowerAnalysis';
import UserTopFollowers from './UserTopFollowers';
import UserFavorites from './UserFavorites';


class UserTab extends React.Component< {data: any}> {
  
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
        <Grid item md={12} lg={5} >
            <UserProfile data={this.props.data} />
            <br/>
            <UserWordCloud data={this.props.data} />  
            <br/>
            <UserTopFollowers data={this.props.data} />
            <br/>
            <UserFavorites data={this.props.data} />
        </Grid>
        <Grid item md={12} lg={7} >
          <UserFollowers data={this.props.data} />
          <br/>
          <UserEngagement data={this.props.data} />
          <br/>
          <UserCategories data={this.props.data} />
          <br/>
          <UserFollowerAnalysis data={this.props.data} />
        </Grid>
      </React.Fragment>
    );
  }

}

export default UserTab;