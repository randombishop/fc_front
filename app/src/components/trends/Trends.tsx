import React, { useState, useEffect } from 'react';
import { Grid, Chip } from '@mui/material';
import AddItem from './AddItem';
import { useParams, useNavigate } from 'react-router-dom';
import { today, nDaysAgo, getBackendUrl } from '../../utils';


class Trends1 extends React.Component<{dateFrom: string, dateTo: string, items: string[],
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
      const num = Number(this.props.itemData[item].data.global.num_casts) ;
      return item + ': ' + num ;
    } catch (error) {
      return item + ': ' + this.props.itemData[item].status ;
    }
  }

  getChipColor = (item: string) => {
    if (!this.props.itemData[item]) {
      return 'default'  ;
    } else {
      try {
        const num = Number(this.props.itemData[item].data.global.num_casts) ;
        if (num > 0) {
          return 'success' ;
        } else {
          return 'error' ;
        }
      } catch (error) {
        if (this.props.itemData[item].status === 'error') {
          return 'error' ;
        } else {
          return 'warning' ;
        }
      } 
    }
  }

  render() {
    return (
      <Grid container spacing={3}>
          <Grid item md={12} >
            <AddItem add={this.props.addItem} />
          </Grid>
          <Grid item md={12} >
            {this.props.items.map((item) => (
              <Chip style={{marginRight: '10px', marginBottom: '10px'}} 
                    variant="outlined"
                    key={item} 
                    label={this.getChipLabel(item)} 
                    color={this.getChipColor(item)}
                    onDelete={this.deleteChip(item)} />
            ))}
          </Grid>
      </Grid>
    );
  }

}

const Trends = (props : any) => {
  
  const [itemData, setItemData] = useState<{ [key: string]: any }>({});

  let { dateFrom, dateTo, terms } = useParams();
  if (!dateFrom) dateFrom = nDaysAgo(15);
  if (!dateTo) dateTo = today();
  if (!terms) terms = '-';
  const items = (terms==='-') ? [] : terms.split(',');

  const navigate = useNavigate();
  
  const addItem = (item: string) => {
    if (items.includes(item)) {
      console.log('Item already exists: '+item);
    } else {
      console.log('Adding item: ', item);
      let newItems = items.slice();
      newItems.push(item);
      const url = '/trends/'+dateFrom+'/'+dateTo+'/'+newItems.join(',');
      navigate(url);
    } 
  } 

  const removeItem = (item: string) => {
    console.log('Removing item: ', item);
    const index = items.indexOf(item);
    if (index !== -1) {
      let newItems = items.slice();
      newItems.splice(index, 1);
      const newItemsString = newItems.length>0?newItems.join(','):'-';
      const url = '/trends/'+dateFrom+'/'+dateTo+'/'+newItemsString;
      navigate(url);
    }
  }

  const pullData = async (item: string) => {
    if (itemData[item]) {
      return;
    }
    try {
      setItemData((prevData) => ({
        ...prevData,
        [item]: {status: 'loading'}
      }));
      let url = getBackendUrl()+'/trends/'
      if (item.startsWith('c_')) {
        url += ('category/'+item) ;
      } else if (item.startsWith('t_')) {
        url += ('topic/'+item) ;
      } else if (item.startsWith('k_')) {
        url += ('keyword/'+item.substring(2)) ;
      } else {
        console.log('Unknown item type: '+item);
        return;
      }
      const response = await fetch(url);
      const data = await response.json();
      setItemData((prevData) => ({
        ...prevData,
        [item]: {status: 'ok', data: data}
      }));
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
  
  return <Trends1 dateFrom={dateFrom} dateTo={dateTo} 
                  items={items} 
                  addItem={addItem} 
                  removeItem={removeItem} 
                  itemData={itemData} />;

};

export default Trends;
