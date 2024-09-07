import React from 'react';
import Panel from '../common/Panel'; 


class UserWordCloud extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <Panel title="Word Cloud">
        hello
      </Panel>
    );
  }

}

export default UserWordCloud;