import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import Trends from './components/Trends';
import DailyDigest from './components/DailyDigest';
import LikeMeter from './components/LikeMeter';
import Clusters from './components/Clusters';
import Profile from './components/Profile';

class App extends React.Component {
  render() {
    return (
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Cyberpunk App
            </Typography>
            <Button color="inherit" href="/">Dashboard</Button>
            <Button color="inherit" href="/trends">Trends</Button>
            <Button color="inherit" href="/daily-digest">Daily Digest</Button>
            <Button color="inherit" href="/like-meter">Like-meter</Button>
            <Button color="inherit" href="/clusters">Clusters</Button>
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
