import React from 'react';
import { Grid, FormControl, Select, MenuItem, InputLabel, TextField } from '@mui/material';
import listChannels from '../data/channels.json';


class BotCommand extends React.Component<{command: string, setCommand: (s: string) => void}> {
  
  parseCommand() {
    let command = this.props.command ;
    //console.log('parsing command', command)
    command = command.trimStart();
    // Must start with digest or best
    const functionMatch = command.match(/^(digest|best)\s*/);
    if (!functionMatch) {
      return {func: null} ;
    }
    const func = functionMatch[1];
    // Now, let's move after the function name
    let restOfCommand = command.slice(functionMatch[0].length);
    const params: any = {};
    if (restOfCommand.indexOf('(') !== -1) {
      const paramsStr = restOfCommand.slice(restOfCommand.indexOf('(')+1, restOfCommand.indexOf(')')).trim();
      const paramRegex = /(\w+)=([\w-]+)/g;
      let match;
      while ((match = paramRegex.exec(paramsStr)) !== null) {
          const key = match[1];
          const value = match[2];
          params[key] = value;
      }
      restOfCommand = restOfCommand.slice(restOfCommand.indexOf(')')+2);
    }
    const keywords = restOfCommand ;
    params.keywords = keywords ;
    const parsed:any = { 
      func: func, 
      params: params 
    };
    //console.log('parsed command', parsed)
    return parsed ;
  }

  formatCommand(command: any) {
    let ans = command.func ;
    ans += '('
    const firstParams = [] ;
    for (const p of Object.keys(command.params)) {
      if (command.params[p] && p !== 'keywords') {
        firstParams.push(p+'='+command.params[p]) ;
      }
    }
    ans += firstParams.join(',') ;
    ans += ') '
    ans += command.params.keywords
    return ans ;
  }

  getFunction() {
    const command = this.parseCommand();
    return command.func;
  }

  getChannel() {
    const command = this.parseCommand();
    if (command.params.channel) {
      return command.params.channel ;
    } else {
      return 'null' ;
    }
  }

  getDays() {
    const command = this.parseCommand();
    if (command.params.days) {
      return command.params.days ;
    } else {
      return 1 ;
    }
  }

  getKeywords() {
    const command = this.parseCommand();
    if (command.params.keywords) {
      return command.params.keywords ;
    } else {
      return '' ;
    }
  }

  handleFunctionChange = (event: any) => {
    const func = event.target.value ;
    const command = this.parseCommand() ;
    command.func = func ;
    const newCommand = this.formatCommand(command) ;
    this.props.setCommand(newCommand) ;
  };

  handleParamChange = (key: string) =>  (event: any) => {
    const param = event.target.value ;
    const command = this.parseCommand() ;
    command.params[key] = param ;
    const newCommand = this.formatCommand(command) ;
    this.props.setCommand(newCommand) ;
  };

  renderInputFunction() {
    return (
      <Grid item>
        <FormControl>
          <InputLabel id="function-label">Function</InputLabel>
          <Select 
            value={this.getFunction()} 
            onChange={this.handleFunctionChange}
            label="Function"
            labelId="function-label">
            <MenuItem value="digest">Digest</MenuItem>
            <MenuItem value="best">Best Cast</MenuItem>       
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderInputChannel() {
    const rows = listChannels.sort((a:any, b:any) => a.name.localeCompare(b.name))
    return (
      <Grid item>
        <FormControl>
          <InputLabel id="channel-label">Channel</InputLabel>
          <Select 
            value={this.getChannel()} 
            onChange={this.handleParamChange('channel')} 
            label="Channel" 
            labelId="channel-label">
            <MenuItem value="null">None</MenuItem>
            {rows.map((channel:any) => (
              <MenuItem key={channel.channel_id} value={channel.channel_id}>{channel.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderInputDays() {
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] ;
    return (
      <Grid item>
        <FormControl>
          <InputLabel id="days-label">Days</InputLabel>
          <Select 
            value={this.getDays()} 
            onChange={this.handleParamChange('days')} 
            label="Days" 
            labelId="days-label">
            {rows.map((d:any) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderInputKeywords() {
    return (
      <Grid item>
        <FormControl>
          <TextField
            value={this.getKeywords()} 
            onChange={this.handleParamChange('keywords')} 
            label="Keywords" 
            fullWidth
          />
        </FormControl>
      </Grid>
    );
  }

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          {this.renderInputFunction()}
          {this.renderInputChannel()}
          {this.renderInputDays()}
          {this.renderInputKeywords()}
        </Grid>
      </div>
    );
  }
  
}

export default BotCommand;
