import React, { createContext, useContext, useState } from 'react';
import { useSignIn } from '@farcaster/auth-kit' ;
import AsyncTaskHandler from './AsyncTaskHandler';
import { getBackendUrl } from './utils';
import { Box, Alert, AlertColor } from '@mui/material';
const AppContext = createContext<any>({});

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [token, setToken] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<{type: AlertColor, message: string}[]>([]);

  const isSignedIn = () => {
    return token !== null ;
  }

  const newAlert = (s: {type: AlertColor, message: string}) => {
    alerts.push(s);
    setAlerts([...alerts]);
  }

  const backendGET = (path: string, callback: (data: any) => void, onError: (error: any) => void) => {
    const get:any = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    if (token) {
      get.headers['Authorization'] = `Bearer ${token}` ;
    }
    fetch(getBackendUrl() + path, get)
      .then(response => response.json())
      .then(data => callback(data))
      .catch(error => {
        newAlert({type: 'error', message: error});
        if (onError) {
          onError(error);
        }
      });
  }

  const backendPOST = (path: string, payload: any, callback: (data: any) => void) => {
    const post:any = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
    if (token) {
      post.headers['Authorization'] = `Bearer ${token}` ;
    }
    fetch(getBackendUrl()+path, post)
      .then(response => response.json())
      .then(data => callback(data))
      .catch(error => newAlert({type: 'error', message: 'Error:' + error}));
  }

  const farcasterAuth = useSignIn({}) ;

  const signOut = () => {
    setToken(null) ;
    farcasterAuth.signOut() ;
  }  

  const newTaskHandler = () => {
    return new AsyncTaskHandler(token) ;
  }

  const value:any = {
    newAlert: newAlert,
    setToken: setToken,
    signOut: signOut,
    backendGET: backendGET,
    backendPOST: backendPOST,
    newTaskHandler: newTaskHandler,
    isSignedIn: isSignedIn(),
    alerts: alerts
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {alerts.map((alert, index) => (
          <Alert 
            key={index} 
            severity={alert.type}
            onClose={() => {
              const newAlerts = [...alerts];
              newAlerts.splice(index, 1);
              setAlerts(newAlerts);
            }}
            sx={{
              minWidth: '300px',
              boxShadow: 3
            }}
          >
            {alert.message}
          </Alert>
        ))}
      </Box>

    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export {
  AppContext,
  AppContextProvider,
  useAppContext
};
