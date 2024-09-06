import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Panel from '../common/Panel'; 


class UserProfile extends React.Component< {name: string,
                                            avatar: string}> {
  
  render() {
    return (
      <Panel title="Profile">
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={this.props.name} src={this.props.avatar} />
          <Typography variant="h6">{this.props.name}</Typography>
        </Stack>
      </Panel>
    );
  }

}

export default UserProfile;