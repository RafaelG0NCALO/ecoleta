import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import userStore from '../stores/userStore';

export default function CreateUser() {
    const store = userStore();
    const navigate = useNavigate(); 
    
    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: '',
    });

    const validateForm = () => {
        let valid = true;
        let newErrors = { nome: '', email: '', senha: '' };

        if (!store.createForm.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
            valid = false;
        }

        if (!store.createForm.email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(store.createForm.email)) {
            newErrors.email = 'E-mail inválido';
            valid = false;
        }

        if (!store.createForm.senha.trim()) {
            newErrors.senha = 'Senha é obrigatória';
            valid = false;
        } else if (store.createForm.senha.length < 6) {
            newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleCreateUser = async (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        try {
          await store.createUser();
          navigate('/login');  
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
      <div className='w-full h-full min-h-[calc(100vh-80px)] py-5 pb-10 flex justify-center items-center'>
        <div className='w-full max-w-[1440px] items-center justify-center flex p-4'>
          <form onSubmit={handleCreateUser} className='w-full max-w-3xl bg-white p-6 rounded-xl'>
            <h1 className='text-4xl font-bold text-[#322153] mb-10'>Cadastro</h1>
            <h1 className='text-xl font-bold text-[#322153] mb-4'>Dados</h1>
            
            <InputField 
              onChange={store.updateCreateFormField}
              value={store.createForm.nome}
              name="nome"
              label="Nome Completo"
              type="text"
              placeholder="Preencha o nome completo"
              error={errors.nome} 
            />

            <InputField 
              onChange={store.updateCreateFormField}
              value={store.createForm.email}
              name="email"
              label="E-mail"
              type="text"
              placeholder="Preencha o E-mail"
              error={errors.email}
            />

            <InputField 
              onChange={store.updateCreateFormField}
              value={store.createForm.senha}
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
                  Cadastrar Usuário
              </div>
            </button>

          </form>
        </div>
      </div>
    );
}
