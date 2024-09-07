import React from 'react';
import Panel from '../common/Panel'; 


class UserEngagement extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <Panel title="Engagement Received">
        hello
      </Panel>
    );
  }

}

export default UserEngagement;