import React from 'react';
import emoji from '../assets/emoji.png';
import { Link } from 'react-router-dom';
import { Cog, Coins, Telescope, MapPin, BookOpen } from 'lucide-react';
import localStore from '../stores/localStore';

export default function Welcome({ userData }) {

  const { local } = localStore();
  const hasLocalRegistered = local.local && local.local.length > 0;

  if (!userData) {
    return <div>Carregando dados do usuário...</div>; // Exibe mensagem enquanto os dados estão sendo carregados
  }
  const userType = userData.conta === 2 ? 'local' : 'user';

  return (
    <div className='w-full flex items-center justify-between max-md:flex-wrap gap-5 pt-6'>
      <div className='w-full'>
        <div className='flex'>
          <img className='object-contain pr-2' src={emoji} alt="emoji" />
          <h1 className='text-[#322153] font-bold text-2xl'>
            Bem vindo, {userData?.nome || 'Usuário'}
          </h1>
        </div>
        <h1 className='text-[#6C6C80]'>
          {userData.conta === 2 ? 'Gerencie seu ponto de coleta.' : 'Encontre no mapa um ponto de coleta.'}
        </h1>
      </div>

      <div className='flex justify-end w-full gap-5'>
        {userType === 'user' ? (
          <>
            <Link to='/profile-user' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
              <div className='h-full min-w-14 bg-[#2FB86E] flex items-center justify-center'>
                <Cog />
              </div>
              <div className='text-white px-4 w-full text-center'>
                Perfil
              </div>
            </Link>
            <Link to='/premios' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
              <div className='h-full min-w-14 bg-[#2FB86E] flex items-center justify-center'>
                <Coins />
              </div>
              <div className='text-white px-4 w-full text-center'>
                Prêmios
              </div>
            </Link>
            <Link to='/pontos-de-coleta' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
              <div className='h-full min-w-14 bg-[#2FB86E] flex items-center justify-center'>
                <Telescope />
              </div>
              <div className='text-white px-4 w-full text-center'>
                Visitar
              </div>
            </Link>
          </>
        ) : (
          <>
          {hasLocalRegistered ? '' :
            <Link to='/criar-ponto-de-coleta' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
              <div className='h-full min-w-14 bg-[#2FB86E] flex items-center justify-center'>
                <MapPin />
              </div>
              <div className='text-white px-4 w-full text-center'>
                Adicionar ponto de coleta
              </div>
            </Link>
            }
            <Link to='/local-profile' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
              <div className='h-full min-w-14 bg-[#2FB86E] flex items-center justify-center'>
                <BookOpen />
              </div>
              <div className='text-white px-4 w-full text-center'>
                Visitas
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
