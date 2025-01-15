import React from 'react';
import { SignInButton, UseSignInData } from '@farcaster/auth-kit';
import { MenuList, MenuItem, Paper, ClickAwayListener} from '@mui/material';
import { AppContext } from '../../AppContext' ;
import Loading from '../common/Loading' ;


class Profile extends React.Component {
  
  static contextType = AppContext ;

  state = {
    dropDown: false,
    loggingOut: false
  }

  onFarcasterLoginSuccess = async (res: UseSignInData) => {
    const message = res.message;
    const signature = res.signature;
    const payload = {message, signature} ;
    const context:any = this.context ;
    context.backendPOST('/login', payload, (data: any) => {
      const token = data.token ;
      context.setToken(token) ;
    });
  }

  onFarcasterLoginError = (error: any) => {
    const context:any = this.context ;
    context.newAlert(error) ;
  }

  signOut = () => {
    const context:any = this.context ;
    context.signOut() ;
    this.setState({loggingOut: true}) ;
    setTimeout(() => {
      this.setState({loggingOut: false}) ;
    }, 500) ;
  }

  toggleDropDown = () => {
    const context:any = this.context ;
    const signedIn = context.isSignedIn ;
    if (signedIn) {
      this.setState({dropDown: !this.state.dropDown})
    }
  }

  renderSignIn = () => {
    if (!this.state.loggingOut) {
      return (
        <SignInButton 
          hideSignOut={true} 
          onSuccess={this.onFarcasterLoginSuccess}
          onError={this.onFarcasterLoginError} />
      ) ;
    } else {
      return (
        <Loading />
      ) ;
    }
  }

  renderMenu = () => {
    const context:any = this.context ;
    if (this.state.dropDown && context.isSignedIn) {
      return (
        <ClickAwayListener onClickAway={() => this.setState({dropDown: false})}>
          <Paper
            style={{
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
              borderRadius: '8px', 
            }}
          >
            <MenuList>
              <MenuItem>My account: xxx credits (wip)</MenuItem>
              <MenuItem onClick={this.signOut}>Sign Out</MenuItem>
            </MenuList>
          </Paper>
        </ClickAwayListener>
      )
    }
  }

  render() {
    return (
      <div style={{
          position: 'absolute',
          marginTop:'10px',        
          zIndex: 1,
          width: 'auto'
        }} 
        onClick={this.toggleDropDown}>        
          {this.renderSignIn()}
          {this.renderMenu()}
      </div>
    );
  }

}

export default Profile;
