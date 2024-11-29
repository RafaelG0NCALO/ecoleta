import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import criar from '../assets/criar.png';
import localimage from '../assets/localimage.png';
import Pessoinhas2 from '../assets/Pessoinhas2.png';
import TitleSubtitle from '../components/TitleSubtitle';
import Welcome from '../components/Welcome';
import localStore from '../stores/localStore';
import { MapPin, Telescope } from 'lucide-react';

export default function LocalProfile() {
  const { local, fetchUserProfileLocal, loggedInLocal } = localStore();
  const navigate = useNavigate();
  const [visitas, setVisitas] = useState([]); 
  const [visitantes, setVisitantes] = useState({});
  const [userNotfound, setUserNotfound] = useState({}); // Altere para um objeto

  const fetchVisitas = async () => {
    const userId = local._id;

    if (userId) {
      try {
        const response = await axios.get(`/listar-visitas/${userId}`);
        const visitasData = response.data.visitas;

        const visitantePromises = visitasData.map(async (visita) => {
          const visitanteId = visita.visitante;
          try {
            const visitanteResponse = await axios.get(`/listar-visitante/${visitanteId}`);
            return {
              visitanteId,
              nome: visitanteResponse.data.nome,
              error: null, // Caso não tenha erro
            };
          } catch (error) {
            console.error('Erro ao buscar dados do visitante', error);
            return { visitanteId, nome: 'Usuário não existe mais', error: true }; // Adiciona o erro
          }
        });

        const visitantesData = await Promise.all(visitantePromises);
        const visitantesMap = visitantesData.reduce((acc, { visitanteId, nome }) => {
          acc[visitanteId] = nome;
          return acc;
        }, {});

        const visitanteErrors = visitantesData.reduce((acc, { visitanteId, error }) => {
          if (error) acc[visitanteId] = true;
          return acc;
        }, {});

        setVisitantes(visitantesMap);
        setVisitas(visitasData);
        setUserNotfound(visitanteErrors); // Atualiza o estado de erros

      } catch (error) {
        console.error('Erro ao buscar visitas', error);
      }
    }
  };

  useEffect(() => {
    if (local && local._id) {
      fetchVisitas();
    }
  }, [local]);

  useEffect(() => {
    if (!loggedInLocal) {
      navigate('/login-local');
    } else {
      fetchUserProfileLocal();
    }
  }, [loggedInLocal, navigate]);

  const handleConfirmarVisita = async (visitaId, visitanteId, itens) => {
    console.log("ID da Visita:", visitaId);
    console.log("ID do Visitante:", visitanteId);
    
    const somaPontos = itens.reduce((total, item) => total + item.pontos, 0);
    console.log("Soma dos pontos:", somaPontos);
  
    try {
      const response = await axios.put(`/status/${visitanteId}`, {
        pontos: somaPontos,
        visitaId: visitaId, 
      });
      
      if (response.status === 200) {
        console.log('Pontos atualizados e visita confirmada com sucesso!');
  
        // Atualizando o estado de visitas para refletir a mudança
        setVisitas((prevVisitas) => {
          return prevVisitas.map((visita) => {
            if (visita._id === visitaId) {
              return { ...visita, status: true };  // Atualizando a visita com status confirmada
            }
            return visita;
          });
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar pontos e status da visita:", error);
    }
  };
  
  if (!local) {
    return <div>Carregando dados do usuário...</div>;
  }

  const hasLocalRegistered = local.local && local.local.length > 0;

  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] flex justify-center">
      <div className="w-full max-w-[1440px] flex items-center flex-col p-4">
        <Welcome userData={local} />

        {!hasLocalRegistered ? (
          <div className="items-center gap-4 justify-between max-md:justify-center flex max-md:flex-wrap-reverse p-4">
            <div className="relative">
              <img
                src={criar}
                className="w-full max-w-[700px] max-h-[650px] object-contain"
              />
            </div>
            <div className="w-full max-w-[500px] px-2">
              <h1 className="font-bold text-5xl text-[#322153] mt-3">
                Crie um ponto de coleta.
              </h1>
              <h1 className="text-2xl text-[#6C6C80] my-6">
                Você ainda não possui um ponto de coleta.
              </h1>
            </div>
          </div>
        ) : (
          <>
            <div className="flex mb-4 justify-between items-center w-full bg-[url('assets/bannerLocal.png')] bg-center rounded-md p-4 bg-cover text-2xl h-32 mt-10 relative">
              <div className="w-28 h-28 rounded-full flex items-center justify-center translate-y-14">
                <img src={localimage} alt="" />
              </div>
              <img
                src={Pessoinhas2}
                className="object-contain w-36 h-w-36 -translate-y-4"
              />
            </div>
            <TitleSubtitle
              title="Essas são suas próximas visitas"
              subtitle="Confirme que o item foi entregue para que sejam enviados os pontos."
            />
                        <div className='grid max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-3 gap-6'>
           {visitas.length > 0 ? (
  visitas
    .filter((visita) => !userNotfound[visita.visitante])
    .map((visita) => {
      const visitanteId = visita.visitante;
      return (
        <div key={visita._id} className='bg-[#34CB79] mt-4 p-5 rounded-lg'>

          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-semibold text-white'>
            {visitantes[visita.visitante] || 'Carregando...'}
            </h1>
              <div className='p-3 w-10 h-10 flex items-center rounded-full bg-white'>
              <Telescope />
            </div>
          </div>
            
          <h5 className='text-green-900 mt-2'>
            Status:
              </h5>
                <p className={`${visita.status ? 
                  'bg-green-200 p-2 rounded-md' : 
                  'bg-yellow-200 p-2 rounded-md'}`}>
                {visita.status ? 'Concluída' : 'Pendente'}
          </p>

          <h3 className="mt-4 text-lg font-medium">Itens entregues:</h3>
          <ul>
            {visita.itens.length > 0 ? (
              visita.itens.map((item, index) => (
                <div key={index} className='p-3 mt-2 flex justify-between bg-green-600 text-white rounded-md border-green-800 border-2'>
                  <strong>{item.descricao}</strong>  
                  {item.pontos} pontos
                </div>
              ))
            ) : (
              <li className="ml-4">Nenhum item registrado.</li>
            )}
          </ul>
          
          <button
            onClick={() => handleConfirmarVisita(visita._id, visitanteId, visita.itens)}
            className="disabled:opacity-30 mt-3 h-10 bg-green-800 text-white w-full"
            disabled={visita.status || userNotfound[visitanteId]} // Desabilita se o visitante não for encontrado
          >
            Confirmar Visita
          </button>
        </div>
      );
    })
) : (
  <p>Não há visitas registradas para este local.</p>
)}
</div>

          </>
        )}
      </div>
    </div>
  );
}
