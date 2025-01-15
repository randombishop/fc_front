import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LikeMeterInput from './LikeMeterInput';
import LikeMeterTask from './LikeMeterTask';



class LikeMeter1 extends React.Component<{ token: string, 
                                           newToken: (token: string) => void }> {

  render() {
    if (this.props.token==='-') {
      return (
        <LikeMeterInput newToken={this.props.newToken} />
      ) ;
    } else {
      return (
        <LikeMeterTask token={this.props.token} />
      ) ;
    }
  }

}

const LikeMeter = () => {
  
  let { token } = useParams();
  if (!token) token = '-';
  
  const navigate = useNavigate();
  
  const newToken = (token: string) => {
    const url = '/insights/like-meter/'+token;
    navigate(url);
  }
   
  return <LikeMeter1 token={token} newToken={newToken} />;

};

export default LikeMeter ;
