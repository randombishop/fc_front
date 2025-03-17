import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { Grid, Alert } from '@mui/material';




const RequireSignIn = (component: React.ReactElement) => {
  const { isSignedIn } = useContext(AppContext);

  if (!isSignedIn) {
    return (
      <Grid item xs={12}>
        <Alert severity="info">Please sign in to use this feature.</Alert>
      </Grid>
    );
  } else {
    return component;
  }
};

export default RequireSignIn ;
