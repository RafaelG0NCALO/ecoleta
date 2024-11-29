import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userStore from '../stores/userStore';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function ListVisit() {
  const { user, fetchUserProfile, loggedIn } = userStore();
  const [visitas, setVisitas] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      fetchUserProfile();
      fetchVisitas();
    }
  }, [loggedIn, fetchUserProfile, navigate]);

  const fetchVisitas = async () => {
    try {
      const response = await axios.get('/visita');
      setVisitas(response.data.visitas);
    } catch (error) {
      console.error('Erro ao buscar as visitas:', error);
    }
  };

  const handleCancelVisit = async (localId, visitaId) => {
    try {
      await axios.delete(`/visita/${visitaId}`, {
        data: { localId, userId: user._id }
      });
      setVisitas((prevVisitas) => {
        return prevVisitas.map((visitaItem) => {
          const visitasFiltradas = visitaItem.visitas.filter(visita => visita._id !== visitaId);
          return { ...visitaItem, visitas: visitasFiltradas };
        }).filter(visitaItem => visitaItem.visitas.length > 0);
      });
      alert('Visita cancelada com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar visita:', error);
      alert('Ocorreu um erro ao cancelar a visita. Tente novamente.');
    }
  };
  
  if (visitas === null) {
    return <div>Você não tem visitas</div>;
  }

  if (!user) {
    return <div>Usuário não encontrado!</div>;
  }

  return (
    <div className='w-full grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-2 justify-start mt-5' >
      
        {visitas.length === 0 ? (
          <p>Você ainda não registrou nenhuma visita.</p>
        ) : (
          visitas.map((visitaItem, index) => (
            <div className='bg-[#34CB79] p-5 rounded-lg' key={index}>
              <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold text-white'>Localização</h1>
                <div className='p-3 w-10 h-10 flex items-center rounded-full bg-white'>
                  <MapPin />
                </div>
              </div>

              <div className='h-60 rounded-lg overflow-hidden mt-5'>
                <MapContainer
                  center={[visitaItem.location[0], visitaItem.location[1]]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[visitaItem.location[0], visitaItem.location[1]]}>
                    <Popup>
                      Olá, este é o seu local!
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <h3 className='mt-3 text-xl text-white font-semibold'>{visitaItem.local}</h3>
              <h5 className='text-green-900 mt-2'>
                Cidade:  
              </h5>
              <p className='text-white'>
              {visitaItem.cidade}
              </p>

              {visitaItem.visitas.length === 0 ? (
                <p>Nenhuma visita registrada para este local.</p>
              ) : (
                visitaItem.visitas.map((visita, visitaIndex) => (
                  <div key={visitaIndex} style={{ marginBottom: '20px' }}>
                    <h5 className='text-green-900 mt-2'>
                    Status:
                    </h5>
                    <p className={`${visita.status ? 
                      'bg-green-200 p-2 rounded-md' : 
                      'bg-yellow-200 p-2 rounded-md'}`}>
                       {visita.status ? 'Concluída' : 'Pendente'}
                    </p>

                    {visita.itens.length > 0 ? (
                      <div>
                        <h5 className='text-green-900 mt-2'>Itens:</h5>
                        <div className=''>
                          {visita.itens.map((item, itemIndex) => (
                            <div className='p-3 mt-2 flex justify-between bg-green-600 text-white rounded-md border-green-800 border-2' key={itemIndex}>
                              <strong>{item.descricao}</strong>  {item.pontos} pontos
                            </div>
                          ))}
                        </div>
                        {visita.status === false && (
                        <button 
                  className='bg-red-400 p-2 rounded-md mt-2'
                  onClick={() => handleCancelVisit(visitaItem.localId, visita._id)}
                >
                  Cancelar
                </button>
                 )}
                      </div>
                    ) : (
                      <p>Não há itens registrados para esta visita.</p>
                    )}
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>
  );
}
