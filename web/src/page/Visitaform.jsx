import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom';
import userStore from '../stores/userStore';
import Welcome from '../components/Welcome';
import FormVisita from '../components/FormVisita';

export default function Visitaform() {
    const { user, fetchUserProfile, loggedIn } = userStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
          navigate('/login');
        } else {
          fetchUserProfile(); 
        }
      }, [loggedIn, fetchUserProfile, navigate]);
      if (!user) {
        return <div>Carregando dados do usuário...</div>;
      }

  return (
    <div className='w-full h-full min-h-[calc(100vh-80px)] flex justify-center'>
      <div className='w-full max-w-[1440px] flex items-center flex-col p-4'>
        <Welcome/>
        
        <FormVisita/>
      </div>
    </div>
  )
}
