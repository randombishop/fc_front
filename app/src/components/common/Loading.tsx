import React from 'react';
import { CircularProgress } from '@mui/material';


class Loading extends React.Component {
  render() {
   return (
      <CircularProgress color="primary" />
    );
  }
}

export default Loading;
