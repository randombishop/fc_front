import React from 'react';
import { SignInButton, UseSignInData } from '@farcaster/auth-kit';
import { AppContext } from '../../AppContext' ;


class Profile extends React.Component {
  
  static contextType = AppContext ;

  onSuccess = async (res: UseSignInData) => {
    const message = res.message;
    const signature = res.signature;
    const payload = {message, signature} ;
    const context:any = this.context ;
    context.backendPOST('/login', payload, (data: any) => {
      const token = data.token ;
      context.login(token) ;
    });
  }

  onSignOut = () => {
    const context:any = this.context ;
    context.logout() ;
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        marginTop:'10px',        
        zIndex: 1,
        width: 'auto',
        backgroundColor: 'gray',
        borderRadius: '10px'
      }}>
        <SignInButton onSuccess={this.onSuccess} onSignOut={this.onSignOut}/>
      </div>
    );
  }

}

export default Profile;
