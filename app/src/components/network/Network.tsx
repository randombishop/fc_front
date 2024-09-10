import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import NetworkSelect from './NetworkSelect';
import NetworkShow from './NetworkShow';


class Network1 extends React.Component<{sample: string, mode: string, item: string, 
                                        selectNetwork: (mode:string, item:string, sample:string) => void,
                                        showNetwork: () => void,
                                        loading: boolean,
                                        data: any}> {

  render() {
    return (
      <Grid container spacing={3}>
          <Grid item xs={12} >
            <NetworkSelect mode={this.props.mode} 
                          item={this.props.item} 
                          sample={this.props.sample} 
                          selectNetwork={this.props.selectNetwork} 
                          showNetwork={this.props.showNetwork} 
                          loading={this.props.loading} />
          </Grid>

          <Grid item xs={12} >
            <hr/>
            <NetworkShow data={this.props.data} loading={this.props.loading} />
          </Grid>
      </Grid>
    );
  }

} 

const Network = (props : any) => {

  const context:any = useAppContext() ;
  
  const [networkData, setNetworkData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  let { mode, item, sample } = useParams();
  if (!mode) {
    mode = '';
  }
  if (!item) {
    item = '';
  }
  if (!sample) {
    sample = 'random';
  }
  const navigate = useNavigate();
  
  const selectNetwork = (sample:string, mode:string, item:string) => {
    const url = '/network/'+sample+'/'+mode+'/'+item ;
    navigate(url);
  }

  const showNetwork = () => {
    setLoading(true) ;
    const url = '/network/'+sample+'/'+mode+'/'+item ;
    context.backendGET(url, (data: any) => {
      setNetworkData(data) ;
      setLoading(false) ;
    });
  }

  return <Network1 mode={mode} item={item} sample={sample} 
                   selectNetwork={selectNetwork} 
                   showNetwork={showNetwork} 
                   loading={loading}
                   data={networkData}/>;

};

export default Network;