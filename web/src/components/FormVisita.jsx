import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import TitleSubtitle from './TitleSubtitle';
import CardResiduos from './CardResiduos';

import Bateria from '../assets/Baterias.png';
import Lampadas from '../assets/Lampadas.png';
import Eletronicos from '../assets/Eletronicos.png';
import Oleos from '../assets/Oleo.png';
import Organicos from '../assets/Organicos.png';
import Papel from '../assets/Papel.png';
import userStore from '../stores/userStore';

const residuos = [
  { id: 'item1', title: 'Pilhas e Baterias', img: Bateria, points: 250 },
  { id: 'item2', title: 'Lâmpadas', img: Lampadas, points: 150 },
  { id: 'item3', title: 'Eletrônicos', img: Eletronicos, points: 200 },
  { id: 'item4', title: 'Óleo', img: Oleos, points: 100 },
  { id: 'item5', title: 'Orgânicos', img: Organicos, points: 120 },
  { id: 'item6', title: 'Papéis e Papelão', img: Papel, points: 160 },
];

const FormVisita = () => {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialsPositionMap, setInitialsPositionMap] = useState(null);
  const [selectedResiduos, setSelectedResiduos] = useState({});
  const [filteredLocais, setFilteredLocais] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);
  
  const user = userStore((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        await userStore.getState().fetchUserProfile();
      }
    };
    fetchUser();
  }, [user]);

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

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        const response = await axios.get('/locais');
        const allLocais = response.data.reduce((acc, item) => {
          const locaisWithUserId = item.local.map(local => ({
            ...local,
            userId: item._id,
            userName: item.nome
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

  useEffect(() => {
    const selectedResiduosTitles = Object.entries(selectedResiduos)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => residuos.find(r => r.id === id)?.title);
    if (selectedResiduosTitles.length === 0) {
      setFilteredLocais([]);
      return;
    }
    const filtered = locais.filter(point =>
      point.residuos.some(residuo =>
        selectedResiduosTitles.includes(residuo.title)
      )
    );
    setFilteredLocais(filtered);
  }, [selectedResiduos, locais]);

  const handleLocalSelect = (point) => {
    setSelectedLocal(point);
    console.log(`Local selecionado:`, point);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocal) {
      alert("Por favor, selecione um local no mapa.");
      return;
    }
  
    if (!user) {
      alert("Você precisa estar logado para realizar uma visita.");
      return;
    }
  
    const selectedItems = Object.entries(selectedResiduos)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => {
        const residuo = residuos.find(r => r.id === id);
        return {
          descricao: residuo.title,
          pontos: residuo.points
        };
      });
  
    if (selectedItems.length === 0) {
      alert("Selecione ao menos um item de resíduo.");
      return;
    }
  
    const visitaData = {
      localId: selectedLocal.userId, 
      itens: selectedItems,
    };
  
    try {
      const token = document.cookie.split('Authorization=')[1]; 
  
      const response = await axios.post('/visita', visitaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 201) {
        console.log('Visita registrada com sucesso', response.data);
        alert('Visita registrada com sucesso!');

        setSelectedResiduos({}); 
        setSelectedLocal(null);   
      } else {
        console.error('Erro ao registrar visita:', response.data);
        alert('Erro ao registrar visita.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      alert('Erro ao tentar registrar a visita.');
    }
  };
  

  const customIcon = L.divIcon({
    className: 'bg-green-500 rounded-full w-6 h-6 flex items-center justify-center',
    html: '<div class="w-4 h-4 bg-white rounded-full"></div>',
    iconSize: [24, 24]
  });

  const handleChange = (event) => {
    const { id, checked } = event.target;
    setSelectedResiduos((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!initialsPositionMap) return <div>Carregando sua localização...</div>;

  const hasSelectedItems = Object.values(selectedResiduos).some(v => v);

  return (
    <form className="w-full mb-6" onSubmit={handleSubmit}>
      <TitleSubtitle 
        title="Itens de coleta" 
        subtitle="Selecione os coletáveis" 
      />
      <CardResiduos 
        selectedItems={selectedResiduos} 
        onChange={handleChange} 
        residuos={residuos} 
      />

      <TitleSubtitle
        title="Seleciona o ponto para visita"
        subtitle={
          hasSelectedItems
            ? `Mostrando ${filteredLocais.length} ${filteredLocais.length === 1 ? 'ponto disponível' : 'pontos disponíveis'}`
            : "Selecione itens acima para ver os pontos de coleta disponíveis"
        }
      />

      <div className="h-96 w-full my-6">
        <MapContainer
          center={initialsPositionMap}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredLocais.map((point) => (
            <Marker
              key={point._id}
              position={point.location}
              icon={customIcon}
            >
              <Popup>
                <div className="w-48">
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{point.userName}</h3>
                    <div className="mt-2">
                      <p className="text-sm font-semibold">Materiais aceitos:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {point.residuos.map((material) => (
                          <span
                            key={material._id}
                            className={`px-2 py-1 text-xs rounded-full ${
                              selectedResiduos[
                                residuos.find(r => r.title === material.title)?.id
                              ]
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {material.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLocalSelect(point)}
                    className={`w-full h-10 rounded-md text-white ${
                      selectedLocal?._id === point._id 
                        ? 'bg-green-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {selectedLocal?._id === point._id ? 'Selecionado' : 'Selecionar'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <button 
        type="submit"
        className='bg-[#34CB79] px-2 w-full flex justify-center overflow-hidden items-center h-12 rounded-md text-white'
      >
        Realizar visita
      </button>
    </form>
  );
};

export default FormVisita;