import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { AppContextProvider } from './AppContext';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Trends from './components/trends/Trends';
import Users from './components/users/Users';
import Bot from './components/bot/Bot';
import LikeMeter from './components/likemeter/LikeMeter';
import Footer from './components/common/Footer';
import Network from './components/network/Network';


const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'app.datascience.art'
};


class App extends React.Component {

  render() {
    return (
      <AuthKitProvider config={farcasterConfig}>
        <AppContextProvider>
          <Router>
            <Header />
            <Container sx={{marginTop: '20px',
                            display: 'flex', 
                            flexDirection: 'column',
                            height: '90vh'}}>
              <Routes>
                <Route path="/" Component={Dashboard} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/trends/:terms" Component={Trends} />
                <Route path="/users/:terms" Component={Users} />
                <Route path="/bot" Component={Bot} />
                <Route path="/like-meter/:token" Component={LikeMeter} />
                <Route path="/network/:sample/:filter/:mode/:item?" Component={Network} />
              </Routes>
              <Box sx={{ flexGrow: 1 }} />
              <Footer />
            </Container>
          </Router>
        </AppContextProvider>
      </AuthKitProvider>
    );
  }

}

export default App;
