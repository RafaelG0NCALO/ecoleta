import { User } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import criar from '../assets/criar.png';
import Pessoinhas2 from '../assets/Pessoinhas2.png';
import localimage from '../assets/localimage.png';
import TitleSubtitle from '../components/TitleSubtitle';
import Welcome from '../components/Welcome';
import localStore from '../stores/localStore';

export default function LocalProfile() {
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

  const hasLocalRegistered = local.local && local.local.length > 0;

  return (
    <div className='w-full h-full min-h-[calc(100vh-80px)] flex justify-center'>
      <div className='w-full max-w-[1440px] flex items-center flex-col p-4'>
        <Welcome userData={local} />
        
        {!hasLocalRegistered ?
          <div className='items-center gap-4 justify-between max-md:justify-center flex max-md:flex-wrap-reverse p-4'>
            <div className='relative'>
              <img src={criar} className='w-full max-w-[700px] max-h-[650px] object-contain' />
            </div>
            <div className='w-full max-w-[500px] px-2'>
              <h1 className='font-bold text-5xl text-[#322153] mt-3'>
                Crie um ponto de coleta.
              </h1> 
              <h1 className='text-2xl text-[#6C6C80] my-6'>
                Você ainda não possui um ponto de coleta.
              </h1> 
            </div>
          </div>
      : 
        <>
          <div className="flex mb-4 justify-between items-center w-full bg-[url('assets/bannerLocal.png')] bg-center rounded-md p-4 bg-cover text-2xl h-32 mt-10 relative">
            <div className='w-28 h-28 rounded-full flex items-center justify-center translate-y-14'>
              <img src={localimage} alt="" />
            </div>
            <img src={Pessoinhas2} className='object-contain w-36 h-w-36 -translate-y-4' />
          </div>
          <TitleSubtitle title="Essas são suas  próximas visitas" subtitle="Confirme que o item foi entregue para que sejam enviados os pontos."/>
        </>
        }
      </div>
    </div>
  );
}
