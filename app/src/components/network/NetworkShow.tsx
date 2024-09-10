import React from 'react';
import Loading from '../common/Loading';



class NetworkShow extends React.Component< {data: any, loading: boolean}> {
  
  render() {
    if (this.props.loading) {
      return <Loading /> ;
    }
    const data = this.props.data ;
    if (!data || !data.nodes || !data.links) {
      return null ;
    }
    const nodes = data.nodes ;
    const links = data.links ;
    const num_users = nodes.length ;
    const num_links = links.length ;
    const connectivity = 100 * num_links / (num_users * (num_users - 1)) ;
    return (
      <React.Fragment>
        Num users: {num_users} - Num links: {num_links} - Connectivity: {connectivity.toFixed(2)}%
      </React.Fragment>
    );
  }

}

export default NetworkShow;