import React from 'react';
import { Grid } from '@mui/material';
import {getBackendUrl} from '../../utils' ;
import DigestCard from './DigestCard' ;



class DailyDigest extends React.Component {
  
  state = {
    data: []
  }
  
  componentDidMount() {
    fetch(`${getBackendUrl()}/digests/latest`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => alert('Error:' + error));
  }
  
  render() {
    const num = this.state.data.length ;
    const half = Math.ceil(num / 2) ;
    const col1 = this.state.data.slice(0, half) ;
    const col2 = this.state.data.slice(half, num) ;
    return (
      <Grid container spacing={5}>
        <Grid item md={6}>
          {col1.map((item, index) => (
              <DigestCard key={index} data={item} />
          ))}
        </Grid>
        <Grid item md={6}>
          {col2.map((item, index) => (
              <DigestCard key={index} data={item} />
          ))}
        </Grid>
      </Grid>
      
    );
  }
}

export default DailyDigest;
