import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import localStore from '../../stores/localStore';

export default function RequireAuthLocal(props) {
  const store = localStore();

  useEffect(() => {
    if(store.loggedInLocal === null){
        store.checkAuthLocal()
    }
}, [])

  if(store.loggedInLocal === null){
    return <div>Loading</div>
  }

  if(store.loggedInLocal === false){
    return <Navigate to="/login-local" />;
  }

  return <div>{props.children}</div>
}
