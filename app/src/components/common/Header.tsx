import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AppLogo from '../../assets/logo_white_nobg.png';
import Profile from '../profile/Profile';
import { useLocation } from 'react-router-dom';

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
      return (
        <AppBar position="static">
          <Toolbar>
            <img src={AppLogo} style={imgStyle} alt="Data Science Art" />
            <Typography variant="h6" style={titleStyle}>
              Farcaster<br />Data
            </Typography>
            <Button color={this.getButtonColor('/dashboard', true)} href="#/dashboard">Dashboard</Button>
            <Button color={this.getButtonColor('/trends')} href="#/trends/-/-">Trends</Button>
            <Button color={this.getButtonColor('/daily-digest')} href="#/daily-digest/today">Daily Digest</Button>
            <Button color={this.getButtonColor('/like-meter')} href="#/like-meter/new">Like-meter</Button>
            <Button color={this.getButtonColor('/clusters')} href="#/clusters/">Clusters</Button>
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

