import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Trends from './components/trends/Trends';
import DailyDigest from './components/digest/DailyDigest';
import LikeMeter from './components/likemeter/LikeMeter';
import Clusters from './components/clusters/Clusters';


class App extends React.Component {

  render() {
    return (
      <Router>
        <Header />
        <Container style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/" Component={Dashboard} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/trends/:dateFrom/:dateTo/:terms" Component={Trends} />
            <Route path="/daily-digest/:day" Component={DailyDigest} />
            <Route path="/like-meter/:token" Component={LikeMeter} />
            <Route path="/clusters" Component={Clusters} />
          </Routes>
        </Container>
      </Router>
    );
  }

}

export default App;
