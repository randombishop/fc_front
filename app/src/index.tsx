import './assets/fonts/reddit_mono/RedditMono.css';
import '@farcaster/auth-kit/styles.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaults } from 'chart.js';
import theme from './theme';
import { colors } from './utils';
import App from './App';

defaults.color = colors.light;
defaults.borderColor = colors.light;
defaults.backgroundColor = 'black' ;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);


