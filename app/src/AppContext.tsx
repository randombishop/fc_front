import React, { createContext, useContext } from 'react';
import { getBackendUrl } from './utils';
import AsyncTaskHandler from './AsyncTaskHandler';


const AppContext = createContext<any>({});

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
   
  let token:string|null = null;
  let alerts = [] ;

  const login = (newToken: string) => {
    token = newToken;
    console.log('Context login: '+token);
  };

  const logout = () => {
    token = null;
    console.log('Context logout');
  };

  const addAlert = (s: string) => {
    alerts.push(s);
    alert(s);
  }

  const backendGET = (path: string, callback: (data: any) => void) => {
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
      .catch(error => addAlert('Error:' + error));
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
      .catch(error => addAlert('Error:' + error));
  }

  const newTaskHandler = () => {
    return new AsyncTaskHandler(token) ;
  }

  const value:any = {
    login: login,  
    logout: logout,
    backendGET: backendGET,
    backendPOST: backendPOST,
    newTaskHandler: newTaskHandler
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export {
  AppContext,
  AppContextProvider,
  useAppContext
};
