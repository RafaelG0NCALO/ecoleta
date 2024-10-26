import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardGift from '../components/CardGift';
import TitleSubtitle from '../components/TitleSubtitle';
import Welcome from '../components/Welcome';
import userStore from '../stores/userStore';

export default function Premios() {

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
        <Welcome userData={user} />
        <TitleSubtitle title='Resgatar'/>
        <CardGift onClaim={() => fetchUserProfile()}/>
      </div>
    </div>
  );
}
