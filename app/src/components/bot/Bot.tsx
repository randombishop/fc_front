import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, TextField } from '@mui/material';
import BotCommand from './BotCommand';



class Bot1 extends React.Component<{command: string, setCommand: (s: string) => void}> {
  
  sendCommand = () => {
    
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
                    onClick={this.sendCommand}>
              Send Bot Command
            </Button>
          </Grid>
          <Grid item xs={12} >
            RESULTS
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
