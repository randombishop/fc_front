import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, TextField } from '@mui/material';
import BotCommand from './BotCommand';
import { getBackendUrl } from '../../utils';
import Loading from '../common/Loading';
import BotDigest from './BotDigest';
import BotBest from './BotBest';


const POLLING_INTERVAL_SECONDS = 2 ;
const TIMEOUT_SECONDS = 120 ;


class Bot1 extends React.Component<{command: string, setCommand: (s: string) => void}> {
  
  state = {
    enabled: true,
    token: null,
    task: null,
    error: null
  };

  sendCommand = () => {
    this.setState({enabled: false, token: null, task: null, error: null}) ;
    const post = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({command: this.props.command}),
    }
    fetch(`${getBackendUrl()}/bot/run`, post)
      .then(response => response.json())
      .then(data => this.commandResponse(data))
      .catch(error => this.setState({enabled: true, error: error}));
  }

  commandResponse = (data: any) => {
    const token = data.uuid ;
    if (data.insertOK && data.publishOK && token.length>16) {
      this.setState({token: token}, this.fetchTask) ;
    } else {
      this.setState({enabled: true, error: 'Failed sending bot command to backend'}) ;
    }
  }

  fetchTask = () => {
    fetch(`${getBackendUrl()}/task/${this.state.token}`)
      .then(response => response.json())
      .then(data => this.updateTask(data))
      .catch(error => this.setState({ enabled: true, error: error }));
  }

  updateTask = (data: any) => {
    console.log('updateTask', data) ;
    this.setState({ task: data });
    if (data == null) {
      this.setState({ enabled: true, error: 'Received empty response' }) ;
    } else if (data.error) {
      this.setState({ enabled: true, error: data.error }) ;
    } else if (!data.result) {
      const createdAt = new Date(data.created_at) ;
      const time = ((new Date()).getTime() - createdAt.getTime()) / 1000 ;
      if (time < TIMEOUT_SECONDS) {
        setTimeout(this.fetchTask, POLLING_INTERVAL_SECONDS * 1000); 
      } else {
        this.setState({ enabled: true, error: 'Timed out' }) ;
      }
    } else if (data.result) {
      this.setState({ enabled: true, error: null }) ;
    }
  }
  
  renderResult = () => {
    if (this.state.task) {
      const task: any = this.state.task ;
      if (task.result) {
        const func = task.request.command.func ;
        if (func==='digest') {
          return <BotDigest result={task.result} /> ;
        } else if (func==='best') {
          return <BotBest result={task.result} /> ;
        } else {
          return <pre>{JSON.stringify(task.result, null, 2)}</pre> ;
        }
      } else {
        return <Loading /> ;
      }
    }
    return null ;
  }

  render() {
    return (
      <Grid container spacing={3}>
          <Grid item xs={12} >
            <BotCommand command={this.props.command} 
                        setCommand={this.props.setCommand}/>
          </Grid>
          <Grid item xs={8}>
            <TextField
              value={this.props.command} 
              label="Bot Command" 
              fullWidth
            />
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
            <Button variant="contained" 
                    color="primary" 
                    fullWidth
                    disabled={!this.state.enabled}
                    onClick={this.sendCommand}>
              Send Bot Command
            </Button>
          </Grid>
          <Grid item xs={12} >
            {this.renderResult()}
          </Grid>
      </Grid>
    );
  }

}

const Bot = () => {
  
  let { command } = useParams();
  if (command==null) command='';
  
  const navigate = useNavigate();
  
  const setCommand = (newCommand: string) => {
    const url = '/bot/'+newCommand+'/' ;
    navigate(url);
  }

  return <Bot1 command={command} setCommand={setCommand}/>;

};

export default Bot;
