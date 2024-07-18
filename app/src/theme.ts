import { createTheme } from '@mui/material/styles';
import { fontFamily, colors } from './utils';



const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary
    }
  },
  typography: {
    fontFamily: fontFamily,
  },
});

export default theme;
