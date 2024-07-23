import React from 'react';
import { Grid } from '@mui/material';
import {getBackendUrl} from '../../utils' ;
import DigestCard from './DigestCard' ;



class DailyDigest extends React.Component {
  
  state = {
    data: []
  }
  
  componentDidMount() {
    let self = this ;
    fetch(`${getBackendUrl()}/digests/latest`)
      .then(response => response.json())
      .then(data => self.handleDigests(data))
      .catch(error => alert('Error:' + error));
  }
  
  handleDigests(data: any) {
    let self = this ;
    let fids:any = {} ;
    for (const digest of data) {
      const links = digest.links ;
      for (const link of links) {
        const fid = link.fid ;
        fids[fid] = true ;
      }
    }
    fids = Object.keys(fids).join(',') ;
    fetch(`${getBackendUrl()}/usernames/${fids}`)
      .then(response => response.json())
      .then(usernames => self.handleUsernames(data, usernames))
      .catch(error => alert('Error:' + error));
  }

  handleUsernames(data: any, usernames: any) {
    const userMap:any = {} ;
    for (const row of usernames) {
      userMap[row.fid] = row.user_name ;
    }
    for (const digest of data) {
      const links = digest.links ;
      const newLinks = [] ;
      for (const link of links) {
        const fid = link.fid ;
        const user = userMap[fid] ;
        if (user) {
          newLinks.push({
            user: user,
            hash: '0x'+link.hash
          }) ;
        } else {
          console.warn('Could not find user for fid:', fid) ;
        }
      }
      digest.links = newLinks ;
    }
    this.setState({ data }) ;
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
