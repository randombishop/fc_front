import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0ff',
    },
    secondary: {
      main: '#f0f',
    },
    background: {
      default: '#000',
      paper: '#121212',
    },
    text: {
      primary: '#0ff',
      secondary: '#f0f',
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
  },
});

export default theme;
