import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppContext } from '../../AppContext';
import DigestCard from './DigestCard' ;
import Loading from '../common/Loading' ;
import dayjs from 'dayjs';



class DailyDigest1 extends React.Component<{day: string, 
                                            setDay: (day: string) => void}> {
  
  
  static contextType = AppContext ;

  state = {
    data: []
  }
  
  componentDidMount() {
    this.loadData1() ;
  }
  
  componentDidUpdate(prevProps: any) {
    if (prevProps.day !== this.props.day) {
      this.loadData1();
    }
  }

  loadData1() {
    this.setState({data: []}) ;
    let self = this ;
    const day = this.props.day ;
    let path = '/digests/' ;
    if (day === 'latest') {
      path += 'latest' ;
    } else {
      path += 'day/'+day ;
    }
    const context:any = this.context ;
    context.backendGET(path, (data: any) => {
      self.loadData2(data) ;
    });
  }

  loadData2(data: any) {
    let self = this ;
    let fids:any = {} ;
    for (const digest of data) {
      const links = digest.links ;
      for (const link of links) {
        const fid = link.fid ;
        fids[fid] = true ;
      }
    }
    fids = Object.keys(fids).join(',') ;
    const context:any = this.context ;
    context.backendGET(`/usernames/${fids}`, (usernames: any) => {
      self.loadData3(data, usernames) ;
    });
  }

  loadData3(data: any, usernames: any) {
    const userMap:any = {} ;
    for (const row of usernames) {
      userMap[row.fid] = row.user_name ;
    }
    for (const digest of data) {
      const links = digest.links ;
      const newLinks = [] ;
      for (const link of links) {
        const fid = link.fid ;
        const user = userMap[fid] ;
        if (user) {
          newLinks.push({
            user: user,
            hash: '0x'+link.hash
          }) ;
        } else {
          console.warn('Could not find user for fid:', fid) ;
        }
      }
      digest.links = newLinks ;
    }
    this.setState({ data }) ;
  }



  handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const day = date.format('YYYY-MM-DD') ;
      this.props.setDay(day) ;
    }
  };

  renderHeader() {
    const day = this.props.day ;
    let digestDate = null ;
    if (this.state.data.length > 0) {
      const digest0:any = this.state.data[0] ;
      digestDate = digest0.day.slice(0, 10) ;
    }
    let selectedDate = null ;
    if (day !== 'latest') {
      selectedDate = dayjs(day) ;
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          {digestDate ? (
            <Typography variant="h4">
              Daily Digest {digestDate}
            </Typography>
          ) : (
            <Loading />
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date" 
                        value={selectedDate} 
                        minDate={dayjs('2024-07-15')}
                        maxDate={dayjs()}
                        onChange={this.handleDateChange}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    );
  }

  renderDigest() {
    const num = this.state.data.length ;
    if (num === 0) {
      return null ;
    }
    const half = Math.ceil(num / 2) ;
    const col1 = this.state.data.slice(0, half) ;
    const col2 = this.state.data.slice(half, num) ;
    return (
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          {col1.map((item, index) => (
              <DigestCard key={index} data={item} />
          ))}
        </Grid>
        <Grid item xs={12}md={6}>
          {col2.map((item, index) => (
              <DigestCard key={index} data={item} />
          ))}
        </Grid>
      </Grid>
    );
  }
  
  render() {
    return (
      <React.Fragment>
        {this.renderHeader()}
        <hr/> 
        {this.renderDigest()}
      </React.Fragment>
    );
  }

}

const DailyDigest = () => {
  
  let { day } = useParams();
  if (!day) day = 'latest';
  
  const navigate = useNavigate();
  
  const setDay = (day: string) => {
    const url = '/digest/'+day;
    navigate(url);
  }
   
  return <DailyDigest1 day={day} setDay={setDay} />;

};

export default DailyDigest;
