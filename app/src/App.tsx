import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import Trends from './components/Trends';
import DailyDigest from './components/DailyDigest';
import LikeMeter from './components/LikeMeter';
import Clusters from './components/Clusters';
import Profile from './components/Profile';
import AppLogo from './assets/logo_white_nobg.png';




class App extends React.Component {
  render() {
    const imgStyle = { 
      height: '50px', 
      width: 'auto' 
    } ;
    const titleStyle = {
      marginLeft: '50px',
      marginRight: '50px', 
      fontWeight: 'bold', 
      color: 'white',
      textShadow: '2px 2px 4px #318787',
      lineHeight: '24px',
      textAlign: 'center' as const
    } ;
    return (
      <Router>
        <AppBar position="static">
          <Toolbar>
            <img src={AppLogo} style={imgStyle} />
            <Typography variant="h6" style={titleStyle}>
              Farcaster<br/>Data
            </Typography>
            <Button color="inherit" href="/">Dashboard</Button>
            <Button color="inherit" href="/trends">Trends</Button>
            <Button color="inherit" href="/daily-digest">Daily Digest</Button>
            <Button color="inherit" href="/like-meter">Like-meter</Button>
            <Button color="inherit" href="/clusters">Clusters</Button>
            <div style={{ flexGrow: 1 }}></div>
            <Profile />
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/" Component={Dashboard} />
            <Route path="/trends" Component={Trends} />
            <Route path="/daily-digest" Component={DailyDigest} />
            <Route path="/like-meter" Component={LikeMeter} />
            <Route path="/clusters" Component={Clusters} />
          </Routes>
        </Container>
      </Router>
    );
  }
}

export default App;
