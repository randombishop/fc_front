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
      rows.push({label: "Followers", value: features.followers_num});
      rows.push({label: "Following", value: features.following_num});
    }
    if (info) {
      rows.push({label: "Account registered", value: info.fid_registered_at.slice(0,10)});
    }
    if (features && features.first_cast) {
      rows.push({label: "First Cast", value: features.first_cast.value.slice(0,10)});
    }
    if (features && features.msg_messages_per_day) {
      rows.push({label: "Messages per day", value: (features.msg_messages_per_day).toFixed(1)});
    }
    if (features && features.msg_avg_time_any) {
      rows.push({label: "Average Time to React", value: (features.msg_avg_time_any/3600).toFixed(1)+" hours"});
    }
    if (features && features.msg_ratio_deletes) {
      rows.push({label: "Message Delete Ratio", value: (features.msg_ratio_deletes*100).toFixed(1)+"%"});
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