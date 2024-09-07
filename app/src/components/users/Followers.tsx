import React from 'react';
import Panel from '../common/Panel'; 


class Followers extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <Panel title="Followers">
        hello
      </Panel>
    );
  }

}

export default Followers;