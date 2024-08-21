import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Trends from './components/trends/Trends';
import Bot from './components/bot/Bot';
import LikeMeter from './components/likemeter/LikeMeter';


class App extends React.Component {

  render() {
    return (
      <Router>
        <Header />
        <Container style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/" Component={Dashboard} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/trends/:terms" Component={Trends} />
            <Route path="/bot/:command" Component={Bot} />
            <Route path="/like-meter/:token" Component={LikeMeter} />
          </Routes>
        </Container>
      </Router>
    );
  }

}

export default App;
