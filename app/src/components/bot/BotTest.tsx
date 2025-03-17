import React from 'react';
import { Grid, TextField, Button, Alert } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Loading from '../common/Loading';
import BotCast from './BotCast';
import { AppContext } from '../../AppContext';
import RequireSignIn from '../common/RequireSignIn';


class BotTest1 extends React.Component {

  static contextType = AppContext ;

  state = {
    query: '',
    loading: false,
    cost: null,
    result: null,
    error: null
  };

  placeholder = `Submit a command to the bot in natural language, for example:
  * Who are @dwr.eth's favorite users?
  * Who is most active in /data channel?
  * Give me a summary about bitcoin
  * Show me the funniest cast in tabletop channel
  * Make wordcloud for @vitalik.eth
  * Roast @randombishop
  * Psycho analyze @randombishop
  `

  begin = (doNext: () => void) => {
    this.setState({loading: true, cost: null, result: null, error: null}, doNext);
  };

  handleQueryChange = (event: any) => {
    this.setState({ query: event.target.value });
  };

  openBotInfo = () => {
    const url = 'https://github.com/randombishop/fc_bots/blob/main/bots/catalog.py'
    window.open(url, '_blank');
  };

  quoteQuery = async () => {
    if (this.state.query.length < 10) {
      alert('Please enter a query (min 10 characters)') ;
      return ;
    }
    this.begin(async () => {
      const context:any = this.context ;
      const taskHandler = context.newTaskHandler() ;
      const payload = {query: this.state.query};
      const task = await taskHandler.runTask('/bot/quote', payload);
      const cost = task.result?task.result.cost : null ;
      this.setState({loading: false, cost: cost, error: task.error});
    }) ;
  };

  startQuery = () => {
    if (this.state.query.length < 10) {
      alert('Please enter a query (min 10 characters)') ;
      return ;
    }
    this.begin(async () => {
      const context:any = this.context ;
      const taskHandler = context.newTaskHandler() ;
      const payload = {query: this.state.query};
      const task = await taskHandler.runTask('/bot/run', payload);
      this.setState({loading: false, result: task.result, error: task.error});
    }) ;
  };

  renderLoading = () => {
    if (this.state.loading) {
      return <Loading />;
    }
  };

  renderError = () => {
    if (this.state.error) {
      return <Alert severity="error">{this.state.error}</Alert>;
    }
  };

  renderCost = () => {
    if (this.state.cost) {
      return <Alert severity="success">Your query will cost {this.state.cost} credits.</Alert>;
    }
  };

  renderResult = () => {
    if (this.state.result) {
      const result:any = this.state.result ;
      if (result.casts && result.casts.length > 0) {
        const casts = result.casts ;
        return (
          <React.Fragment>
            {casts.map((cast: any, index: number) => (
              <BotCast cast={cast} key={index} />
            ))}
          </React.Fragment>
        );
      }
    }
  };

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <TextField
            label="Enter your query"
            placeholder={this.placeholder}
            value={this.state.query}
            onChange={this.handleQueryChange}
            multiline
            minRows={8}
            maxRows={30}
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <Button onClick={this.openBotInfo} fullWidth startIcon={<HelpIcon />}>
            Bot Commands 
          </Button>
          <Button onClick={this.quoteQuery} fullWidth startIcon={<RequestQuoteIcon />}
            disabled={this.state.loading}>
            Quote
          </Button>
          <br/><br/>
          {this.renderLoading()}
          {this.renderError()}
          {this.renderCost()}
        </Grid>

        <Grid item xs={12}>
          <Button onClick={this.startQuery} fullWidth
            variant="contained"
            style={{ marginTop: '10px' }}
            disabled={this.state.loading}>
            Run Query
          </Button>
        </Grid>

        {this.renderResult()}
        
      </Grid>
    );
  }
}


const BotTest = () => {
  return RequireSignIn(<BotTest1 />)
};

export default BotTest ;
