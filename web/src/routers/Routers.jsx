import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from '../components/RouterController/RequireAuth.jsx';
import RequireAuthLocal from '../components/RouterController/RequireAuthLocal.jsx';
import Home from '../page/Home.jsx';
import ProfileUser from '../page/ProfileUser.jsx';
import CreateUser from '../page/CreateUser.jsx';
import CreateLocal from '../page/CreateLocal.jsx';
import Login from '../page/Login.jsx';
import Visitaform from '../page/Visitaform.jsx';
import Premios from '../page/Premios.jsx';
import LoginLocal from '../page/LoginLocal.jsx';
import LocalProfile from '../page/LocalProfile.jsx';
import ProtectedRoute from '../components/RouterController/ProtectedRouter.jsx';


const Routers = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="home" />} />
        <Route path="home" element={<Home />} />
        <Route path="cadastro-de-usuario" element={<CreateUser />} />
        <Route path="cadastro-de-local" element={<CreateLocal />} />

        <Route path="login" element={
           <ProtectedRoute element={<Login />} />
        }/>

        <Route path="login-local" element={
           <ProtectedRoute element={<LoginLocal />} />
        }/>

        <Route 
        path="profile-user" 
        element={
        <RequireAuth> 
          <ProfileUser/> 
        </RequireAuth>} />

        <Route 
        path="pontos-de-coleta" 
        element={
        <RequireAuth> 
          <Visitaform/> 
        </RequireAuth>} />

        <Route 
        path="premios" 
        element={
        <RequireAuth> 
          <Premios/> 
        </RequireAuth>} 
        />

        <Route 
        path="local-profile" 
        element={
        <RequireAuthLocal> 
          <LocalProfile/> 
        </RequireAuthLocal>} 
        />

      </Routes>
  );
};

export default Routers;
