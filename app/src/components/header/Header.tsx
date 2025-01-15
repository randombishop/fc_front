import React from 'react';
import { AppBar, Toolbar, Button, Grid, Box } from '@mui/material';
import AppLogo from '../../assets/logo_white_nobg.png';
import Profile from '../profile/Profile';
import { useLocation } from 'react-router-dom';
import MiniGridItem from '../common/MiniGridItem';
import HeaderMenuInsights from './HeaderMenuInsights';
import HeaderMenuBot from './HeaderMenuBot';


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
      
      
      return (
        <AppBar position="static">
          <Toolbar>
            <Grid container spacing={3}>
              <Grid item xs={6} md={2} lg={1}>
                <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                  <img src={AppLogo} style={imgStyle} alt="Data Science Art" />
                </Box>
              </Grid>
              <Grid item xs={6} md={2} lg={1}
                    sx={{display: {xs: 'none',sm: 'none', 'md': 'flex'}}}>
                <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" height="100%" style={titleStyle}>
                  Farcaster<br />Data
                </Box>
              </Grid>
              <MiniGridItem>
                <Button color={this.getButtonColor('/dashboard', true)} href={dashboardUrl}>Dashboard</Button>
              </MiniGridItem>
              <MiniGridItem>
                <HeaderMenuInsights color={this.getButtonColor('/insights')} />
              </MiniGridItem>
              <MiniGridItem>
                <HeaderMenuBot color={this.getButtonColor('/bot')} />
              </MiniGridItem>
              <Grid item xs={12} md={3} lg={2} display='flex' justifyContent='center' alignItems='top' sx={{height: '100px', marginBottom: '2px'}}>
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