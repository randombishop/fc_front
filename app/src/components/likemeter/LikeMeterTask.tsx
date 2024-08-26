import React from 'react';
import Loading from '../common/Loading';
import LikeMeterResult from './LikeMeterResult';
import { AppContext } from '../../AppContext';


const POLLING_INTERVAL_SECONDS = 2 ;
const TIMEOUT_SECONDS = 120 ;


class LikeMeterTask extends React.Component<{ token: string }> {
  
  static contextType = AppContext ;

  state = {
    task: null,
    error: null
  };

  componentDidMount() {
    this.pullData() ;
  }

  pullData = () => {
    const context:any = this.context ;
    context.backendGET(`/task/${this.props.token}`, (data: any) => {
      this.continue(data) ;
    });
  }

  continue = (data: any) => {
    this.setState({ task: data });
    if (data.error) {
      this.setState({ error: data.error }) ;
    } else if (data) {
      const createdAt = new Date(data.created_at) ;
      const time = ((new Date()).getTime() - createdAt.getTime()) / 1000 ;
      if (!data.result && time < TIMEOUT_SECONDS) {
        setTimeout(this.pullData, POLLING_INTERVAL_SECONDS * 1000); 
      }
    }
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error}</div>;
    } else if (this.state.task === null) {
      return <Loading />;
    } else {
      const task: any = this.state.task ;
      const result = task.result ;
      if (result) {
        return (
          <LikeMeterResult task={task} />
        );
      } else {
        const createdAt = new Date(task.created_at) ;
        const time = ((new Date()).getTime() - createdAt.getTime()) / 1000 ;
        if (time > TIMEOUT_SECONDS) {
          return <div>Sorry, this request timed out. Please try again.</div>;
        } else {
          return <Loading />;
        }
      }
    }
  }

}

export default LikeMeterTask;
