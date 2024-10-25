import React from 'react'
import emoji from '../assets/emoji.png';
import { Link } from 'react-router-dom';
import { Cog, Coins, Telescope } from 'lucide-react';
import userStore from '../stores/userStore';

export default function Welcome() {
  const { user } = userStore();
  
  return (
    <div className='w-full flex items-center justify-between max-md:flex-wrap gap-5 pt-6'>
         <div className='w-full'>
              <div className='flex'>
                <img className='object-contain pr-2' src={emoji} />
                <h1 className='text-[#322153] font-bold text-2xl'>Bem vindo, {user.nome}</h1>
              </div>
              <h1 className='text-[#6C6C80]'>Encontre no mapa um ponto de coleta.</h1>
          </div>
        <div className='flex justify-end w-full gap-5'>
            <Link to='/profile-user' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
                <div className='h-full min-w-14 bg-[#2FB86E]  flex items-center justify-center'>
                <Cog />
                </div> 
                <div className='text-white px-4 w-full text-center'>
                  Perfil
                </div>
            </Link>
            <Link to='/premios' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
                <div className='h-full min-w-14 bg-[#2FB86E]  flex items-center justify-center'>
                <Coins />
                </div> 
                <div className='text-white px-4 w-full text-center'>
                 Prêmios
                </div>
            </Link>
            <Link to='/pontos-de-coleta' className='bg-[#34CB79] max-md:w-full flex justify-between overflow-hidden items-center h-12 rounded-md text-white'>
                <div className='h-full min-w-14 bg-[#2FB86E]  flex items-center justify-center'>
                <Telescope />
                </div> 
                <div className='text-white px-4 w-full text-center'>
                  Visitar
                </div>
            </Link>
          </div>
    </div>
  )
}
