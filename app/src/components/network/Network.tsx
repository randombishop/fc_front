import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import NetworkSelect from './NetworkSelect';
import NetworkShow from './NetworkShow';


class Network1 extends React.Component<{sample: string, filter: string, mode: string, item: string, 
                                        selectNetwork: (mode:string, filter:string, item:string, sample:string) => void,
                                        showNetwork: () => void,
                                        loading: boolean,
                                        data: any}> {

  render() {
    return (
      <React.Fragment>  
        <NetworkSelect mode={this.props.mode} 
                        filter={this.props.filter}
                        item={this.props.item} 
                        sample={this.props.sample} 
                        selectNetwork={this.props.selectNetwork} 
                        showNetwork={this.props.showNetwork} 
                        loading={this.props.loading} />
        <br/>
        <NetworkShow data={this.props.data} loading={this.props.loading} />
      </React.Fragment>
    );
  }

} 

const Network = (props : any) => {

  const context:any = useAppContext() ;
  
  const [networkData, setNetworkData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  let { sample, filter, mode, item} = useParams();
  if (!sample) {
    sample = 'random';
  }
  if (!filter) {
    filter = '10';
  }  
  if (!mode) {
    mode = '';
  }
  if (!item) {
    item = '';
  }
  
  const navigate = useNavigate();
  
  const selectNetwork = (sample:string, filter:string, mode:string, item:string) => {
    const url = '/insights/network/'+sample+'/'+filter+'/'+mode+'/'+item ;
    navigate(url);
  }

  const showNetwork = () => {
    setNetworkData(null) ;
    setLoading(true) ;
    const url = '/network/'+sample+'/'+filter+'/'+mode+'/'+item ;
    context.backendGET(url, (data: any) => {
      setNetworkData(data) ;
      setLoading(false) ;
    }, (error: any) => {
      setLoading(false) ;
      context.newAlert({type: 'error', message: error}) ;
    });
  }

  return <Network1 sample={sample} filter={filter} mode={mode} item={item} 
                   selectNetwork={selectNetwork} 
                   showNetwork={showNetwork} 
                   loading={loading}
                   data={networkData}/>;

};

export default Network;