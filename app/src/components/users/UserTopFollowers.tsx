import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Panel from '../common/Panel'; 


class UserTopFollowers extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data || !data.topFollowers) {
      return null ;
    }
    const topFollowers = data.topFollowers ;
    return (
      <Panel title="Top Followers">
        <Table>
          <TableBody>
            {topFollowers.map((u: any) => (
              <TableRow key={u.fid}>
                <TableCell component="th" scope="row">
                  {u.user_name}
                </TableCell>
                <TableCell align="right">{u.followers_num}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    );
  }

}

export default UserTopFollowers;