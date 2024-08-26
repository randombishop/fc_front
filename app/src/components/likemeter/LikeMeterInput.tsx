import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { AppContext } from '../../AppContext' ;


class LikeMeterInput extends React.Component<{ newToken: (token: string) => void }> {
  
  static contextType = AppContext ;

  state = {
    enabled: true,
    text: ''
  };

  handleTextChange = (event: any) => {
    this.setState({ text: event.target.value });
  };

  score = () => {
    this.setState({enabled: false}) ;
    const text = this.state.text;
    const context:any = this.context ;
    context.backendPOST('/predict_like/score', {text: text}, (data: any) => {
      this.continue(data) ;
    });
  };

  continue = (data: any) => {
    const token = data.uuid ;
    if (data.insertOK && data.publishOK && token.length>16) {
      this.props.newToken(token) ;
    } else {
      console.error('Error') ;
      this.setState({enabled: true}) ;
    }
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Enter text"
            value={this.state.text}
            onChange={this.handleTextChange}
            multiline
            maxRows={8}
            fullWidth
          />
          <Button onClick={this.score} fullWidth 
                  style={{ marginTop: '10px' }}
                  disabled={!this.state.enabled}>
            Score
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default LikeMeterInput;
