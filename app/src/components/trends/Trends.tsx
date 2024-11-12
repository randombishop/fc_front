import React, { useState, useEffect } from 'react';
import { Grid, Chip } from '@mui/material';
import AddItem from './AddItem';
import { useParams, useNavigate } from 'react-router-dom';
import { getColorForItem } from '../../utils';
import { useAppContext } from '../../AppContext';
import TrendVolume from './TrendVolume';
import TrendFeatures from './TrendFeatures';


class Trends1 extends React.Component<{items: string[],
                                       addItem: (item: string) => void,
                                       removeItem: (item: string) => void,
                                       itemData: any }> {

  deleteChip = (item: string) => () => {
    this.props.removeItem(item);
  }
  
  getChipLabel = (item: string) => {
    if (!this.props.itemData[item]) {
      return item + ': ?'  ;
    }
    try {
      const num = this.props.itemData[item].data.global.num_casts ;
      return item + ': ' + num ;
    } catch (error) {
      return item + ': ' + this.props.itemData[item].status ;
    }
  }

  getChipColor = (idx: number) => {
    return getColorForItem('light', idx) ;
  }

  resultsReady() {
    for (const item of this.props.items) {
      try {
        const num = this.props.itemData[item].data.rows.length ;
        if (num > 0) {
          return true ;
        }
      } catch (e) {}
    }
    return false ;
  }

  renderResults() {
    if (!this.resultsReady()) {
      return null ;
    }
    return (
      <React.Fragment>
        <Grid item xs={12} >
          <TrendVolume items={this.props.items} data={this.props.itemData} />
        </Grid>
        <Grid item xs={12} >
          <TrendFeatures items={this.props.items} data={this.props.itemData} />
        </Grid>
      </React.Fragment>
    ) ;
  }

  render() {
    return (
      <Grid container spacing={3}>
          <Grid item xs={12} >
            <AddItem add={this.props.addItem} />
          </Grid>
          <Grid item xs={12} >
            {this.props.items.map((item, idx) => (
              <Chip style={{marginRight: '10px', marginBottom: '10px'}} 
                    variant="outlined"
                    key={item} 
                    label={this.getChipLabel(item)} 
                    onDelete={this.deleteChip(item)} 
                    sx={{color: this.getChipColor(idx), borderColor: this.getChipColor(idx)}}
                    />
            ))}
          </Grid>
          {this.renderResults()}
      </Grid>
    );
  }

}

const Trends = (props : any) => {

  const context:any = useAppContext() ;
  
  const [itemData, setItemData] = useState<{ [key: string]: any }>({});

  let { terms } = useParams();
  if (!terms) terms = '-';
  const items = (terms==='-') ? [] : terms.split(',');

  const navigate = useNavigate();
  
  const addItem = (item: string) => {
    if (items.includes(item)) {
      // do something?
    } else {
      let newItems = items.slice();
      newItems.push(item);
      const url = '/analytics/trends/'+newItems.join(',');
      navigate(url);
    } 
  } 

  const removeItem = (item: string) => {
    const index = items.indexOf(item);
    if (index !== -1) {
      let newItems = items.slice();
      newItems.splice(index, 1);
      const newItemsString = newItems.length>0?newItems.join(','):'-';
      const url = '/analytics/trends/'+newItemsString;
      navigate(url);
    }
  }

  const aggregate = (data: any) => {
    const keys = [
      'casts_per_fid',
      'num_follower',
      'num_following',
      'num_like',
      'num_recast',
      'num_reply',
      'q_funny',
      'q_happiness',
      'q_info',
      'predict_like'
    ]
    const rows = data.rows ;
    for (const row of rows) {
      try {
        row.casts_per_fid = row.num_casts / row.num_fids ;
      } catch (e) {
        row.casts_per_fid = 0 ;
      }
    }
    const totalCasts = rows.reduce((total: number, row: any) => total + row.num_casts, 0);
    const global:any = {}
    global.num_casts = totalCasts;
    if (totalCasts>0) {
      for (const key of keys) {
        try {
          const validRows = rows.filter((row:any) => (row[key] !== null));
          global[key] = validRows.reduce((total: number, row: any) => total + (row[key] * row.num_casts / totalCasts), 0);
        } catch (e) {
          global[key] = 0 ;
        }
      }
    }
    data.global = global ;
  }

  const pullData = (item: string) => {
    if (itemData[item]) {
      return;
    }
    try {
      setItemData((prevData) => ({
        ...prevData,
        [item]: {status: 'loading'}
      }));
      let url = '/trends/'
      if (item.startsWith('c_')) {
        url += ('category/'+item) ;
      } else if (item.startsWith('t_')) {
        url += ('topic/'+item) ;
      } else if (item.startsWith('k_')) {
        url += ('keyword/'+item.substring(2)) ;
      } else if (item.startsWith('q_')) {
        const underscoreIndex = item.lastIndexOf('_');
        const f = item.substring(0, underscoreIndex);
        const v = item.substring(underscoreIndex + 1);
        url += ('feature/'+f+'/'+v) ;
      } else if (item.startsWith('p_')) {
        const channelId = item.substring(2) ;
        url += ('channel/'+channelId) ;
      } else if (item.startsWith('u_')) {
        url += ('from_user/'+item.substring(2)) ;
      } else {
        setItemData((prevData) => ({
          ...prevData,
          [item]: {status: 'error'}
        }));
        return;
      }
      context.backendGET(url, (data: any) => {
        aggregate(data) ;
        setItemData((prevData) => ({
          ...prevData,
          [item]: {status: 'ok', data: data}
        }));
      });
    } catch (error) {
      setItemData((prevData) => ({
        ...prevData,
        [item]: {status: 'error', error: error}
      }));;
    }
  } ; 

  useEffect(() => {
    items.forEach((item) => {
      pullData(item);
    });
    // eslint-disable-next-line
  }, [items]);
  
  return <Trends1 items={items} 
                  addItem={addItem} 
                  removeItem={removeItem} 
                  itemData={itemData} />;

};

export default Trends;