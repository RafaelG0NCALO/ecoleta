import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Welcome from '../components/Welcome';
import localStore from '../stores/localStore';
import FormEditLocal from '../components/FormEditLocal';

export default function EditPoint() {

    const { local, fetchUserProfileLocal, loggedInLocal } = localStore();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!loggedInLocal) {
        navigate('/login-local');
      } else {
        fetchUserProfileLocal();
      }
    }, [loggedInLocal, navigate]);
    
    if (!local) {
      return <div>Carregando dados do usuário...</div>;
    }

  return (
    <div className='w-full h-full min-h-[calc(100vh-80px)] flex justify-center'>
    <div className='w-full max-w-[1440px] flex items-center flex-col p-4'>
      <Welcome userData={local} />
      <FormEditLocal/>
    </div>
  </div>
  )
}
