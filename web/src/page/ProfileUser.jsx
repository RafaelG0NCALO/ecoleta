import { Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Welcome from '../components/Welcome';
import userStore from '../stores/userStore';

export default function ProfileUser() {
  const { user, fetchUserProfile, loggedIn, updateUser, deleteUser } = userStore();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, formData);
      alert('Usuário atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar o usuário.');
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm('Você tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (isConfirmed) {
        deleteUser(user._id)
            .then(() => {
                alert('Sua conta foi excluída com sucesso!');
                navigate('/login');  // Redireciona para a página de login após a exclusão
            })
            .catch((error) => {
                console.error("Erro ao excluir a conta:", error);  // Log detalhado do erro
                if (error.response) {
                    // Se a resposta de erro estiver disponível
                    console.error("Erro no servidor:", error.response.data);
                    alert(`Erro: ${error.response.data.error}`);
                } else {
                    alert('Erro ao excluir a conta. Tente novamente.');
                }
            });
    }
};


  if (!user) {
    return <div>Carregando dados do usuário...</div>;
  }

  return (
    <div className='w-full h-full min-h-[calc(100vh-80px)] flex justify-center'>
      <div className='w-full max-w-[1440px] flex items-center flex-col p-4'>
        <Welcome userData={user}/>

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
              <button 
                type='button'  // Usar 'button' em vez de 'submit' para evitar que o formulário seja enviado
                onClick={handleDelete}  // Chama a função de exclusão ao clicar
                className='bg-[#dc7d5d] transition-all hover:bg-[#d16f4e] w-full mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white'>
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
