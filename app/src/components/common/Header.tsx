import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
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
        marginLeft: '50px',
        marginRight: '50px', 
        fontWeight: 'bold', 
        color: 'white',
        textShadow: '2px 2px 4px #318787',
        lineHeight: '24px',
        textAlign: 'center' as const
      };
      const dashboardUrl = '#/dashboard';
      const trendsUrl = '#/trends/'+nDaysAgo(15)+'/'+today()+'/-';
      const digestUrl = '#/daily-digest/latest';
      const likeMeterUrl = '#/like-meter/new';
      const clustersUrl = '#/clusters' ;
      return (
        <AppBar position="static">
          <Toolbar>
            <img src={AppLogo} style={imgStyle} alt="Data Science Art" />
            <Typography variant="h6" style={titleStyle}>
              Farcaster<br />Data
            </Typography>
            <Button color={this.getButtonColor('/dashboard', true)} href={dashboardUrl}>Dashboard</Button>
            <Button color={this.getButtonColor('/trends')} href={trendsUrl}>Trends</Button>
            <Button color={this.getButtonColor('/daily-digest')} href={digestUrl}>Daily Digest</Button>
            <Button color={this.getButtonColor('/like-meter')} href={likeMeterUrl}>Like-meter</Button>
            <Button color={this.getButtonColor('/clusters')} href={clustersUrl}>Clusters</Button>
            <div style={{ flexGrow: 1 }}></div>
            <Profile />
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

