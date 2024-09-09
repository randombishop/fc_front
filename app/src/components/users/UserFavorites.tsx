import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Panel from '../common/Panel'; 


class UserFavorites extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data || !data.favoriteUsers) {
      return null ;
    }
    const favoriteUsers = data.favoriteUsers ;
    return (
      <Panel title="Favorite Users">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell align="right">Recasts</TableCell>
              <TableCell align="right">Likes</TableCell>
              <TableCell align="right">Replies</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {favoriteUsers.map((user: any) => (
              <TableRow key={user.target_fid}>
                <TableCell>{user.username}</TableCell>
                <TableCell align="right">{user.num_recasts}</TableCell>
                <TableCell align="right">{user.num_likes}</TableCell>
                <TableCell align="right">{user.num_replies}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    );
  }

}

export default UserFavorites;