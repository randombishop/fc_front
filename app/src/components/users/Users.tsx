import React, { useState, useEffect, useContext } from 'react';
import { Grid, Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import AddItem from './AddItem';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UserTab from './UserTab';


class Users1 extends React.Component<{isSignedIn: boolean,
                                      items: string[],
                                      addItem: (item: string) => void,
                                      removeItem: (item: string) => void,
                                      itemData: any }> {


  state = {
    selectedTab: 0
  }

  changeTab = (event:any, newValue:any) => {
    this.setState({selectedTab: newValue}) ;
  };

  renderTabTitle = (key:string) => {
    let label = key ;
    let icon = null;
    if (this.props.itemData && this.props.itemData[key]) {
      const data = this.props.itemData[key] ;
      if (data && data.data && data.data.info && data.data.info.user_name) {
        label = data.data.info.user_name ;
      }
      if (data.status === 'loading') {
        icon = <CircularProgress size={16} color="inherit" />;
      } else if (data.status === 'error') {
        icon = <ErrorOutlineIcon color="error" />;
      }
    }
    return <Tab key={key} label={
      <Box display="flex" alignItems="center">
        {label}
        {icon && <Box ml={1}>{icon}</Box>}
      </Box>
    } /> ;
  }

  renderTabContent() {
    if ((!this.props.items) || (this.props.items.length===0) || (!this.props.itemData)) {
      return null ;
    }
    const selectedItem = this.props.items[this.state.selectedTab] ;
    const itemData = this.props.itemData[selectedItem] ;
    if (!itemData || !itemData.data) {
      return null ;
    }
    const data = itemData.data ;
    return (
      <UserTab data={data} />
    ) ;
  }

  renderTabs() {
    if ((!this.props.items) || (this.props.items.length===0)) {
      return null ;
    }
    const items = this.props.items ;
    return (
      <Grid item xs={12} >
        <Tabs value={this.state.selectedTab} onChange={this.changeTab}>
          {items.map(this.renderTabTitle)}
        </Tabs>
      </Grid>
    ) ;
  }

  render() {
    return (
      <Grid container spacing={3}>
          <Grid item xs={12} >
            <AddItem isSignedIn={this.props.isSignedIn} add={this.props.addItem} />
          </Grid>
          {this.renderTabs()} 
          {this.renderTabContent()}
      </Grid>
    );
  }

}

const Users = (props : any) => {
  
  const { isSignedIn, backendGET } = useContext(AppContext);

  const [itemData, setItemData] = useState<{ [key: string]: any }>({});

  let { terms } = useParams();
  if (!terms) terms = '-';
  const items = (terms==='-') ? [] : terms.split(',');

  const navigate = useNavigate();
  
  const pullData = (item: string) => {
    if (itemData[item]) {
      return;
    }
    try {
      setItemData((prevData) => ({
        ...prevData,
        [item]: {status: 'loading'}
      }));
      let url = '/users/analytics/'+item ;
      backendGET(url, 
        (data: any) => {
          setItemData((prevData) => ({
            ...prevData,
            [item]: {status: 'ok', data: data}
          }));
        },
        (error: any) => {
          setItemData((prevData) => ({
            ...prevData,
            [item]: {status: 'error', error: error}
          }));
        }
      );
    } catch (error) {
      setItemData((prevData) => ({
        ...prevData,
        [item]: {status: 'error', error: error}
      }));;
    }
  } ;

  const addItem = (item: string) => {
    if (items.includes(item)) {
    } else {
      let newItems = items.slice();
      newItems.push(item);
      const url = '/analytics/users/'+newItems.join(',');
      navigate(url);
    } 
  } 

  const removeItem = (item: string) => {
    const index = items.indexOf(item);
    if (index !== -1) {
      let newItems = items.slice();
      newItems.splice(index, 1);
      const newItemsString = newItems.length>0?newItems.join(','):'-';
      const url = '/analytics/users/'+newItemsString;
      navigate(url);
    }
  }

  useEffect(() => {
    items.forEach((item) => {
      pullData(item) ;
    });
    // eslint-disable-next-line
  }, [items]);
  
  return <Users1 isSignedIn={isSignedIn}
                 items={items} 
                 addItem={addItem} 
                 removeItem={removeItem} 
                 itemData={itemData} />;

};

export default Users;