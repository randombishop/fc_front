import React from 'react';
import Panel from '../common/Panel'; 


class UserFollowerAnalysis extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <Panel title="Followers Analysis">
        hello
      </Panel>
    );
  }

}

export default UserFollowerAnalysis;