import React, { useContext } from 'react';
import { Grid, Alert, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import QRCode from 'react-qr-code';
import { AppContext } from '../../AppContext';
import Panel from '../common/Panel'; 
import Loading from '../common/Loading';



class BotActivate1 extends React.Component<{isSignedIn: boolean}> {

  static contextType = AppContext ;

  state = {
    user: null as any,
    creatingBotKey: false,
    approvingBotKey: false,
    approvalToken: null as any,
    approvalUrl: null as any
  };

  componentDidMount = () => {
    if (this.props.isSignedIn) {
      this.loadUserData() ;
    }
  }

  componentDidUpdate(prevProps: {isSignedIn: boolean}) {
    if (!prevProps.isSignedIn && this.props.isSignedIn) {
      this.loadUserData();
    }
  }

  loadUserData = () => {
    const context:any = this.context ;
    context.backendGET('/profile/current_user', (data: any) => {
      this.setState({ user: data });
    });
  }

  createBotKey = () => {
    this.setState({ creatingBotKey: true });
    const context:any = this.context ;
    context.backendPOST('/profile/new_bot_key', {}, (data: any) => {
      this.setState({  user: data, creatingBotKey: false });
    });
  }

  approveBotKey = () => {
    this.setState({ approvingBotKey: true });
    const context:any = this.context ;
    context.backendGET('/profile/key_approval_request', (data: any) => {
      this.setState({ 
        approvingBotKey: false, 
        approvalToken: data.token,
        approvalUrl: data.deeplink_url
      }, this.checkApprovalStatus);
    });
  }

  checkApprovalStatus = async () => {
    console.log(`startApprovalPolling ${this.state.approvalToken}`) ;
    await new Promise((r) => setTimeout(r, 2000));
    const context:any = this.context ;
    context.backendGET(`/profile/key_approval_status/${this.state.approvalToken}`, (data: any) => {
      if (data.status === 'completed') {
        this.setState({
          approvalToken: null,
          approvalUrl: null,
          user: data.user
        });
      } else {
        this.checkApprovalStatus();
      }
    });
  }

  renderLoginMessage = () => {
    if (!this.props.isSignedIn) {
      return (
        <Grid item xs={12}>
          <Alert severity="info">Please sign in to use this feature.</Alert>
        </Grid>
      ) ;
    }
  }

  renderPage = () => {
    if (this.props.isSignedIn) {
      if (this.state.user) {
        return (
            <React.Fragment>
              <Grid item xs={6}>
                {this.renderMembership()}
            </Grid>
            <Grid item xs={6}>
              {this.renderApproval()}
            </Grid>
          </React.Fragment>
        ) ;
      } else {
        return <Loading /> ;
      }
    } 
  }

  renderMembership = () => {
    const membership = this.state.user?.bot_membership ;
    return (
      <Panel title="Membership">
        {membership?
          <p>
            <CheckCircleIcon color="success" style={{verticalAlign: 'bottom'}}/>&nbsp;
            You have access to bot actions.
          </p>
        :
          <React.Fragment>
            <p>To activate bot actions, please contact @randombishop.<br/>
            (In the future, this will be activated by holding some NFT or hypersub sunscription, work in progress...)
            </p>
            <hr />
            <Button variant="contained" color="primary" onClick={this.loadUserData}>Refresh</Button>
          </React.Fragment>
        }
      </Panel>
    ) ;
  }

  renderBotKeyCreated = () => {
    return (
      <p>
        <CheckCircleIcon color="success" style={{verticalAlign: 'bottom'}}/>&nbsp;1. Bot Key created.
      </p>
    )
  }

  renderBotKeyApproved = () => {
    return (
      <p>
        <CheckCircleIcon color="success" style={{verticalAlign: 'bottom'}}/>&nbsp;2. Bot Key Approved.
      </p>
    )
  }

  renderApprovalSteps = () => {
    if (this.state.approvalUrl) {
      return (
        <p>
          <b>Scan the QR code and approve with Warpcast:</b>
          <br/>
          <QRCode value={this.state.approvalUrl} />
        </p>
      ) ;
    } else {
      return (
        <p>
          <Button variant="contained" color="primary" onClick={this.approveBotKey} disabled={this.state.approvingBotKey}>Approve Bot Key</Button>
        </p>
      ) ;
    }
  }

  renderApproval = () => {
    const user = this.state.user ;
    if (!user) return null ;
    const membership = user.bot_membership ;
    if (!membership) return null ;
    const bot_key = user.bot_key  ;
    const bot_approved = user.bot_approved ;
    if (!bot_key) {
      return (
         <Panel title="Authorize Bot">
          <Button variant="contained" color="primary" onClick={this.createBotKey} disabled={this.state.creatingBotKey}>Create Your Bot Key</Button>
         </Panel>
      )
    }
    if (!bot_approved) {
      return (
        <Panel title="Authorize Bot">
          {this.renderBotKeyCreated()}
          <hr/>
          <p>
            <ClearIcon color="error" style={{verticalAlign: 'bottom'}}/>&nbsp;2. Authorize your bot to cast on your behalf
          </p>
          {this.renderApprovalSteps()}
        </Panel>
      )
    }
    return (
      <Panel title="Authorize Bot">
         {this.renderBotKeyCreated()} 
        <hr/>
        {this.renderBotKeyApproved()}
      </Panel>
    ) ;
  }

  render() {
    return (
      <Grid container spacing={3}>
        {this.renderLoginMessage()}
        {this.renderPage()}
      </Grid>
    );
  }
}


const BotActivate = () => {
  const { isSignedIn } = useContext(AppContext);
  return <BotActivate1 isSignedIn={isSignedIn} />
};

export default BotActivate ;
