import React from 'react';
import Panel from '../common/Panel'; 


class UserFavorites extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    return (
      <Panel title="Favorite Users">
        hello
      </Panel>
    );
  }

}

export default UserFavorites;