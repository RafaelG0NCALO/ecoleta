import React, { useEffect, useState } from 'react';
import Welcome from '../components/Welcome';
import localStore from '../stores/localStore';
import { Save, Trash } from 'lucide-react';
import InputField from '../components/InputField';
import { useNavigate } from 'react-router-dom';

export default function EditarLocalPessoal() {
  const { local, fetchUserProfileLocal, loggedInLocal, updateLocal,  deleteLocal } = localStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
  });

  useEffect(() => {
    if (!loggedInLocal) {
      navigate('/login');
    } else {
      fetchUserProfileLocal();
    }
  }, [loggedInLocal, fetchUserProfileLocal, navigate]);

  useEffect(() => {
    if (local) {
      setFormData({
        nome: local.nome || '',
        email: local.email || ''
      });
    }
  }, [local]);

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
      await updateLocal(local._id, formData);
      alert('Usuário atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar o usuário.');
    }
  };

  const handleDeleteAccount = async () => {
    const userId = local._id
    try {
      await deleteLocal(userId);
      alert("Conta deletada com sucesso.");
    } catch (error) {
      alert("Erro ao deletar conta.");
    }
};


  if (!local) {
    return <div>Carregando dados do usuário...</div>;
  }

  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] flex justify-center">
      <div className="w-full max-w-[1440px] flex items-center flex-col p-4">
        <Welcome userData={local} />

        <div className="flex justify-center w-full mt-28 gap-10">
          <form onSubmit={handleSubmit} className="flex-1 max-w-3xl bg-white p-6 rounded-xl">
            <h1 className="text-4xl font-bold text-[#322153] mb-7">Editar Perfil</h1>
            <h1 className="text-xl font-bold text-[#322153] mb-4">Dados</h1>

            <InputField
              name="nome"
              label="Nome Completo"
              type="text"
              placeholder="Preencha o nome completo"
              value={formData.nome}
              onChange={handleInputChange}
            />

            <InputField
              name="email"
              label="E-mail"
              type="text"
              placeholder="Preencha o E-mail"
              value={formData.email}
              onChange={handleInputChange}
            />

            <div className="flex gap-4 mt-7">
              <button
                type="submit"
                className="bg-[#34CB79] transition-all hover:bg-[#2fb169] w-full mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white"
              >
                <div className="text-white px-8 flex gap-5 w-full text-center">
                  <Save /> Salvar
                </div>
              </button>
              <button
              type="button" // Alterado de 'submit' para 'button' para evitar que o formulário seja enviado
              onClick={handleDeleteAccount}
                className="bg-[#cb3434] transition-all hover:bg-[#2fb169] w-full mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white"
              >
                <div className="text-white px-8 flex gap-5 w-full text-center">
                  <Trash /> Deletar conta
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
