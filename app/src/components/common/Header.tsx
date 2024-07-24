import React from 'react';
import { AppBar, Toolbar, Button, Grid, Box } from '@mui/material';
import AppLogo from '../../assets/logo_white_nobg.png';
import Profile from '../profile/Profile';
import { useLocation } from 'react-router-dom';
import { today, nDaysAgo } from '../../utils';


class Header1 extends React.Component<{ location: any }> {

    getButtonColor(path: string, isHome=false) {
        let match = this.props.location.pathname.startsWith(path) ;
        if (isHome) {
            match = match || this.props.location.pathname === '/' ;
        } 
        return match ? 'secondary' : 'primary' ;
    }
  
    render() {
      const imgStyle = { 
        height: '50px', 
        width: 'auto' 
      };
      const titleStyle = {
        fontSize: '24px',
        lineHeight: '24px',
        fontWeight: 'bold', 
        color: 'white',
        textShadow: '2px 2px 4px #318787',
        textAlign: 'center' as const
      };
      const dashboardUrl = '#/dashboard';
      const trendsUrl = '#/trends/'+nDaysAgo(15)+'/'+today()+'/-';
      const digestUrl = '#/daily-digest/latest';
      const likeMeterUrl = '#/like-meter/-';
      const clustersUrl = '#/clusters' ;
      return (
        <AppBar position="static">
          <Toolbar>
            <Grid container spacing={3}>
              <Grid item xs={6} md={2} >
                <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                  <img src={AppLogo} style={imgStyle} alt="Data Science Art" />
                </Box>
              </Grid>
              <Grid item md={2} 
                    sx={{display: {xs: 'none',sm: 'none', 'md': 'flex'}}}>
                <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" height="100%" style={titleStyle}>
                  Farcaster<br />Data
                </Box>
              </Grid>
              <Grid item xs={12} md={6} >
                <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                  <Button color={this.getButtonColor('/dashboard', true)} href={dashboardUrl}>Dashboard</Button>
                  <Button color={this.getButtonColor('/trends')} href={trendsUrl}>Trends</Button>
                  <Button color={this.getButtonColor('/daily-digest')} href={digestUrl}>Digest</Button>
                  <Button color={this.getButtonColor('/like-meter')} href={likeMeterUrl}>Likemeter</Button>
                  <Button color={this.getButtonColor('/clusters')} href={clustersUrl}>Clusters</Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={2} >
                <Profile />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      );
    }

}

const Header = (props : any) => {
    const location = useLocation();
    return <Header1 location={location} />;
};
  

export default Header ;