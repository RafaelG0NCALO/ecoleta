import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Routers from "../routers/Routers";
import logo from '../assets/logo.png';
import { ArrowLeft, Coins, LogOut } from 'lucide-react';
import userStore from '../stores/userStore';

const Layout = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
  const { user, loggedIn, logout } = userStore(); 
  const [pontos, setPontos] = useState(user?.pontos || 0);

  const handleBack = () => {
    navigate('/home'); 
  };
  const handleLogout = async () => {
    await logout(); 
    navigate('/home');
  };

  useEffect(() => {
    if (user) {
      setPontos(user.pontos); 
    }
  }, [user]);

  return (
    <>
      <header className="w-full max-w-[1440px] mx-auto h-20 flex items-center px-4 justify-between">
        <div className="flex items-center">
          <img src={logo} className="w-36" alt="Logo" />
        </div>
        {loggedIn ? (
            <div className='flex items-center gap-4'>
              <div className='flex text-[#2dab66] text-lg items-center gap-2 p-1 px-2 rounded-md border border-[#55dd92]'>
                <Coins/>
                {pontos}
              </div>
              <LogOut className='cursor-pointer' color='#34CB79' onClick={handleLogout}/>
            </div>
        ) : location.pathname !== '/home' ? (
          <button onClick={handleBack} className="mr-4 flex items-center gap-4 text-[] p-2 rounded-md">
            <ArrowLeft color='#34CB79'/> <p className='font-semibold text-[#322153]'>Voltar</p>
          </button>
        ) : (
          <div className='flex gap-2'>
          <Link to='/login' className="bg-[#34CB79] flex items-center h-10 rounded-md text-white px-8">
            Login
          </Link>
          <Link to='/login-local' className="bg-[#9470e8] flex items-center h-10 rounded-md text-white px-8">
            Coleta
          </Link>
          </div>
        )}
      </header>
      <Routers />
    </>
  );
};

export default Layout;
