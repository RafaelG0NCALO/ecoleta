import React, { useEffect, useState } from 'react';
import pessoinhas from '../assets/pessoinhas.png';
import InputField from '../components/InputField';
import userStore from '../stores/userStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const store = userStore();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ email: '', senha: '' });
    const [isLoading, setIsLoading] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({ email: '', senha: '' });

        if (!store.loginForm.email) {
            setErrors((prev) => ({ ...prev, email: 'O e-mail é obrigatório.' }));
            return;
        }
        if (!store.loginForm.senha) {
            setErrors((prev) => ({ ...prev, senha: 'A senha é obrigatória.' }));
            return;
        }

        setIsLoading(true); 

        try {
            await store.login();
            navigate("/profile-user");
        } catch (error) {
            console.log(error.response);
            handleLoginError(error);
        } finally {
            setIsLoading(false); 
        }
    }

    const handleLoginError = (error) => {
        if (error.response) {
            if (error.response.status === 404) {
                setErrors((prev) => ({ ...prev, email: 'O e-mail não existe.' }));
            } else if (error.response.status === 401) {
                setErrors((prev) => ({ ...prev, senha: 'Senha incorreta.' }));
            } else {
                console.error('Erro inesperado:', error.response.data);
            }
        }
        console.error('Erro ao fazer login:', error);
    };

    return (
        <div className='w-full h-full min-h-[calc(100vh-80px)] flex justify-center items-center'>
            <div className='w-full max-w-[1440px] items-center justify-between max-md:justify-center flex max-md:flex-wrap-reverse p-4'>
                <div className='w-full max-w-[500px] px-2'>
                    <h1 className='font-bold text-5xl text-[#322153] mt-3'>Seu marketplace de coleta de resíduos.</h1>
                    <p className='text-2xl text-[#6C6C80] my-6'>Realize o login para acessar seu ambiente.</p>
                    <form onSubmit={handleLogin} className='w-full max-w-3xl bg-white p-6 rounded-xl'>
                        <InputField
                            onChange={store.updateLoginForm}
                            value={store.loginForm.email}
                            name="email"
                            label="E-mail"
                            type="text"
                            placeholder="Preencha o E-mail"
                            error={errors.email}
                        />
                        <InputField
                            onChange={store.updateLoginForm}
                            value={store.loginForm.senha}
                            name="senha"
                            label="Senha"
                            type="password"
                            placeholder="Preencha a senha"
                            error={errors.senha}
                        />
                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`bg-[#34CB79] w-full mt-8 mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white ${isLoading ? 'opacity-50' : ''}`}>
                            <div className='text-white px-8 w-full text-center'>
                                {isLoading ? 'Carregando...' : 'Realizar login'}
                            </div>
                        </button>
                    </form>
                </div>

                <div className='relative'>
                    <img src={pessoinhas} className='w-full max-w-[700px] max-h-[650px] object-contain' />
                </div>
            </div>
        </div>
    );
}
