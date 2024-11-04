import React from 'react';
import { Typography, Stack, Avatar, TableContainer, Table, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import Panel from '../common/Panel'; 


class UserProfile extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    const info = data.info ;
    const features = data.features ;
    const name = info?info.display_name:null ;
    const avatar = info?info.pfp.url:null ;
    const rows: any[] = [];
    if (features) {
      rows.push({label: "Followers", value: features.follower_num});
      rows.push({label: "Following", value: features.following_num});
    }
    if (info) {
      rows.push({label: "Account registered", value: info.fid_registered_at.slice(0,10)});
    }
    if (features && features.casts_all_first) {
      rows.push({label: "First Cast", value: features.casts_all_first.slice(0,10)});
    }
    if (features && features.spam_daily_casts) {
      rows.push({label: "Casts per day", value: (features.spam_daily_casts).toFixed(1)});
    }
    if (features && features.spam_time) {
      rows.push({label: "Average Time to React", value: (features.spam_time).toFixed(1)+" hours"});
    }
    if (features && features.spam_delete_ratio) {
      rows.push({label: "Delete Ratio", value: (features.spam_delete_ratio*100).toFixed(1)+"%"});
    }
    return (
      <Panel title="Profile">
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={name} src={avatar} />
          <Typography variant="h6">{name}</Typography>
        </Stack>
        <hr/>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell><strong>{row.value}</strong></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Panel>
    );
  }

}

export default UserProfile;