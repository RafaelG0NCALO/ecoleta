import React from 'react'
import InputField from './InputField'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localStore from '../stores/localStore';

export default function FormUserLocal() {
  const store = localStore();
  const navigate = useNavigate(); 

  const [errors, setErrors] = useState({ nome: '', email: '', senha: '',});

  const validateForm = () => {
      let valid = true;
      let newErrors = { nome: '', email: '', senha: '' };

      if (!store.createFormLocal.nome.trim()) {
          newErrors.nome = 'Nome é obrigatório';
          valid = false;
      }

      if (!store.createFormLocal.email.trim()) {
          newErrors.email = 'E-mail é obrigatório';
          valid = false;
      } else if (!/\S+@\S+\.\S+/.test(store.createFormLocal.email)) {
          newErrors.email = 'E-mail inválido';
          valid = false;
      }

      if (!store.createFormLocal.senha.trim()) {
          newErrors.senha = 'Senha é obrigatória';
          valid = false;
      } else if (store.createFormLocal.senha.length < 6) {
          newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
          valid = false;
      }

      setErrors(newErrors);
      return valid;
  };

  const handleCreateLocal = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await store.createUserLocal();
        navigate('/login-local');  
      } catch (error) {
          if (error.response && error.response.status === 409) {
              setErrors((prevErrors) => ({
                  ...prevErrors,
                  email: 'Este e-mail já está em uso.',
              }));
          } else {
              console.error('Erro ao criar usuário:', error);
          }
      } 
    }
  }

  return (
    <div className='w-full h-full min-h-[calc(100vh-80px)] py-5 pb-10 flex justify-center items-start'>
    <div className='w-full max-w-[1440px] items-center justify-center flex p-4'>
      <form onSubmit={handleCreateLocal} className='w-full max-w-3xl bg-white p-6 rounded-xl'>
        <h1 className='text-4xl font-bold text-[#322153] mb-10'>Cadastrar Ponto de coleta</h1>
        <h1 className='text-2xl font-bold text-[#322153] mb-4'>Dados</h1>
        
        <InputField 
              onChange={store.updateCreateFormFieldLocal}
              value={store.createFormLocal.nome}
              name="nome"
              label="Nome Completo"
              type="text"
              placeholder="Preencha o nome completo"
              error={errors.nome} 
            />

            <InputField 
              onChange={store.updateCreateFormFieldLocal}
              value={store.createFormLocal.email}
              name="email"
              label="E-mail"
              type="text"
              placeholder="Preencha o E-mail"
              error={errors.email}
            />

            <InputField 
              onChange={store.updateCreateFormFieldLocal}
              value={store.createFormLocal.senha}
              name="senha"
              label="Senha"
              type="password"
              placeholder="Preencha a senha"
              error={errors.senha} 
            />

        <button
        type='submit'
        className='bg-[#34CB79] w-full mt-8 mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white'>
        <div className='text-white px-8 w-full text-center'>
            Cadastrar Ponto de coleta
          </div>
        </button>

      </form>
    </div>
  </div>
  )
}
