import React from 'react';
import Panel from '../common/Panel'; 


class UserCategories extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <Panel title="Categories">
        hello
      </Panel>
    );
  }

}

export default UserCategories;