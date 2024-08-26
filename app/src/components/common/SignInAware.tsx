import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';


const SignInAware = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { isSignedIn } = useContext(AppContext);
    return (
      <WrappedComponent {...props} isSignedIn={isSignedIn} />
    );
  };
};

export default SignInAware;