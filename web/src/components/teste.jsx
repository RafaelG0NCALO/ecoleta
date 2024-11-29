import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import CardResiduos from './CardResiduos';
import TitleSubtitle from './TitleSubtitle';

export default function FormVisita() {

  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialsPositionMap, setInitialsPositionMap] = useState(null); 

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setInitialsPositionMap([latitude, longitude]); 
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
          }
        );
      } else {
        console.error("Geolocalização não é suportada neste navegador.");
      }
    };
    getLocation();
  }, []);

  console.log(initialsPositionMap)

  useEffect(() => {
    const fetchLocais = async () => {
        try {
            const response = await axios.get('/locais');
            const allLocais = response.data.reduce((acc, item) => {
                // Adicionando o userId a cada local
                const locaisWithUserId = item.local.map(local => ({
                    ...local,
                    userId: item._id // ID do usuário que cadastrou
                }));
                return acc.concat(locaisWithUserId);
            }, []);
            setLocais(allLocais);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    fetchLocais();
}, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!initialsPositionMap) {
    return <div>Carregando sua localização...</div>;
  }

  const customIcon = L.divIcon({
    className: 'bg-green-500 rounded-full w-6 h-6 flex items-center justify-center',
    html: '<div class="w-4 h-4 bg-white rounded-full"></div>',
    iconSize: [24, 24]
  });

  return (
    <form className='w-full'>

        <TitleSubtitle
         title='Seleciona o ponto para visita'
         subtitle='Conforme os itens selecionados acima, o mapa mostrará quais pontos estão disponíveis.'
         />

        <div className='h-96 w-full my-6'>
        <MapContainer
          center={initialsPositionMap}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
 
          {locais && locais.length > 0 && locais.map((point) => (
            <Marker
              key={point._id}
              position={point.location}
              icon={customIcon}
            >
              <Popup>
                <div className="w-48">
                  <div className="p-2">
                    <h3 className="font-bold text-lg">Ponto de reciclagem</h3>
                    <p className="text-sm text-gray-600">{point.city}</p>
                    <div className="mt-2">
                      <p className="text-sm font-semibold">Materiais aceitos:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {point.residuos.map((material) => (
                          <span
                            key={material._id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {material.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {console.log(`ID do usuário que cadastrou: ${point.userId}`)}}
                  className='w-full h-10 bg-green-500 rounded-md text-white'>
                  Selecionar
                </button>
              </Popup>
            </Marker>
          ))}
    
        </MapContainer>
        </div>

    </form>
  )
}
