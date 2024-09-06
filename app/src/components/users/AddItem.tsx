import React from 'react';
import { Grid, TextField, Button } from '@mui/material';


class AddItem extends React.Component<{isSignedIn: boolean,
                                       add: (item: string) => void}> {
  
  state = {
    input: ''
  };

  handleInputChange = (event: any) => {
    this.setState({ input: event.target.value });
  };

  addItem = () => {
    this.props.add(this.state.input)
  };

  renderInput() {
    return (
      <Grid item>
        <TextField value={this.state.input} onChange={this.handleInputChange} />
      </Grid>
    );
  }

  renderButton() {
    return (
      <Grid item sx={{display: 'flex', alignItems: 'center'}}>
        <Button variant="contained" color="primary" onClick={this.addItem}>
          Add User
        </Button>
      </Grid>
    );
  }

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          {this.renderInput()}
          {this.renderButton()}
        </Grid>
      </div>
    );
  }
}

export default AddItem;
