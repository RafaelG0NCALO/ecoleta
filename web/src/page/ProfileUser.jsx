import { Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Welcome from '../components/Welcome';
import userStore from '../stores/userStore';

export default function ProfileUser() {
  const { user, fetchUserProfile, loggedIn, updateUser } = userStore();
  const navigate = useNavigate();
  
  // Estados locais para os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
  });

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [loggedIn, fetchUserProfile, navigate]);

  // Atualiza os campos do formulário com os dados do usuário assim que eles estão disponíveis
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Função para lidar com a mudança dos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, formData); // Atualiza o usuário no backend
      alert('Usuário atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar o usuário.');
    }
  };

  if (!user) {
    return <div>Carregando dados do usuário...</div>;
  }

  return (
    <div className='w-full h-full min-h-[calc(100vh-80px)] flex justify-center'>
      <div className='w-full max-w-[1440px] flex items-center flex-col p-4'>
        <Welcome />

        <div className='flex justify-center w-full mt-28 gap-10'>
          <form onSubmit={handleSubmit} className='flex-1 max-w-3xl bg-white p-6 rounded-xl'>
            <h1 className='text-4xl font-bold text-[#322153] mb-7'>Editar Perfil</h1>
            <h1 className='text-xl font-bold text-[#322153] mb-4'>Dados</h1>

            <InputField 
              name="nome"
              label="Nome Completo"
              type="text"
              placeholder="Preencha o nome completo"
              value={formData.nome}
              onChange={handleInputChange} // Atualiza o estado ao mudar os campos
            />

            <InputField 
              name="email"
              label="E-mail"
              type="text"
              placeholder="Preencha o E-mail"
              value={formData.email}
              onChange={handleInputChange} // Atualiza o estado ao mudar os campos
            />

            <div className='flex gap-4 mt-7'>
              <button 
                type='submit' 
                className='bg-[#34CB79] transition-all hover:bg-[#2fb169] w-full mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white'>
                <div className='text-white px-8 flex gap-5 w-full text-center'>
                  <Save /> Salvar
                </div>
              </button>
              <button className='bg-[#dc7d5d] transition-all hover:bg-[#d16f4e] w-full mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white'>
                <div className='text-white px-8 flex gap-5 w-full text-center'>
                  <Trash2 /> Deletar
                </div>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
