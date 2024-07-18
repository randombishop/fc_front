import React from 'react';
import { Grid } from '@mui/material';
import AddItem from './AddItem';
import { useParams, useNavigate } from 'react-router-dom';
import { today, nDaysAgo } from '../../utils';


class Trends1 extends React.Component<{dateFrom: string, 
                                       dateTo: string, 
                                       items: string[],
                                       addItem: (item: string) => void}> {

  render() {
    return (
      <Grid container spacing={3}>
          <Grid item md={12} >
            <AddItem add={this.props.addItem} />
          </Grid>
          <Grid item md={12} >
            {JSON.stringify(this.props.items)}
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

  return <Trends1 dateFrom={dateFrom} dateTo={dateTo} items={items} addItem={addItem} />;
};

export default Trends;
