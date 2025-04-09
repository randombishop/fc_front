import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { AppContextProvider } from './AppContext';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
// Insights
import Dashboard from './components/dashboard/Dashboard';
import Trends from './components/trends/Trends';
import Users from './components/users/Users';
import LikeMeter from './components/likemeter/LikeMeter';
import Network from './components/network/Network';
import Clusters from './components/clusters/Clusters';
// Bot
import BotTest from './components/bot/BotTest';
import BotActivate from './components/bot/BotActivate';
import BotCharacter from './components/bot/BotCharacter';
import BotChannels from './components/bot/BotChannels';


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
                <Route path="/insights/trends/:terms" Component={Trends} />
                <Route path="/insights/users/:terms" Component={Users} />
                <Route path="/insights/network/:sample/:filter/:mode/:item?" Component={Network} />
                <Route path="/insights/clusters" Component={Clusters} />
                <Route path="/insights/like-meter/:token" Component={LikeMeter} />  
                <Route path="/bot/activate" Component={BotActivate} />                              
                <Route path="/bot/character" Component={BotCharacter} />
                <Route path="/bot/channels" Component={BotChannels} />
                <Route path="/bot/test" Component={BotTest} />
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
