import React from 'react';
import Button from '@mui/material/Button';

class Profile extends React.Component {
  handleLogin = () => {
    // Web3 wallet login logic will be added here
    console.log('Web3 login');
  };

  render() {
    return (
      <Button color="inherit" onClick={this.handleLogin}>
        Login with Web3
      </Button>
    );
  }
}

export default Profile;
