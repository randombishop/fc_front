import React from 'react';
import { Grid, Chip } from '@mui/material';
import AddItem from './AddItem';
import { useParams, useNavigate } from 'react-router-dom';
import { today, nDaysAgo } from '../../utils';


class Trends1 extends React.Component<{dateFrom: string, dateTo: string, items: string[],
                                       addItem: (item: string) => void,
                                       removeItem: (item: string) => void}> {

  deleteChip = (item: string) => () => {
    this.props.removeItem(item);
  }
  
  render() {
    return (
      <Grid container spacing={3}>
          <Grid item md={12} >
            <AddItem add={this.props.addItem} />
          </Grid>
          <Grid item md={12} >
            {this.props.items.map((item) => (
              <Chip style={{marginRight: '10px'}} 
                    variant="outlined"
                    key={item} 
                    label={item} 
                    onDelete={this.deleteChip(item)} />
            ))}
          </Grid>
      </Grid>
    );
  }

}

const Trends = (props : any) => {
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
      const url = '/trends/'+dateFrom+'/'+dateTo+'/'+newItems.join(',');
      navigate(url);
    }
  }

  return <Trends1 dateFrom={dateFrom} dateTo={dateTo} items={items} 
                  addItem={addItem} 
                  removeItem={removeItem} />;
};

export default Trends;
