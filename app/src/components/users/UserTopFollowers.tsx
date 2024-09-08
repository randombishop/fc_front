import React from 'react';
import Panel from '../common/Panel'; 


class UserTopFollowers extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <Panel title="Top Followers">
        hello
      </Panel>
    );
  }

}

export default UserTopFollowers;