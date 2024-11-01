import 'leaflet/dist/leaflet.css';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import CardResiduos from './CardResiduos';
import TitleSubtitle from './TitleSubtitle';
import Bateria from '../assets/Baterias.png';
import Lampadas from '../assets/Lampadas.png';
import Eletronicos from '../assets/Eletronicos.png';
import Oleos from '../assets/Oleo.png';
import Organicos from '../assets/Organicos.png';
import Papel from '../assets/Papel.png';
import localStore from '../stores/localStore';

const residuos = [
  { id: 'item1', title: 'Pilhas e Baterias', img: Bateria, points: 250 },
  { id: 'item2', title: 'Lâmpadas', img: Lampadas, points: 150 },
  { id: 'item3', title: 'Eletrônicos', img: Eletronicos, points: 200 },
  { id: 'item4', title: 'Óleo', img: Oleos, points: 100 },
  { id: 'item5', title: 'Orgânicos', img: Organicos, points: 120 },
  { id: 'item6', title: 'Papéis e Papelão', img: Papel, points: 160 },
];

export default function FormCreateLocal() {
  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedMap, setSelectedMap] = useState([0, 0]);
  const [initialsPositionMap, setInitialsPositionMap] = useState(null); 
  const [selectedResiduos, setSelectedResiduos] = useState({});
  
  const store = localStore();

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setInitialsPositionMap([latitude, longitude]); 
            setSelectedMap([latitude, longitude]);
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
    const fetchEstados = async () => {
      try {
        const response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const ufInitials = data.map(uf => uf.sigla);
        setUfs(ufInitials);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    const fetchCidades = async () => {
      if (selectedUf === '0') {
        setCities([]);
        return;
      }
      try {
        const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${selectedUf}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const cityNames = data.map(city => city.nome);
        setCities(cityNames);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCidades();
  }, [selectedUf]);

  function handleSelectUf(event) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  const handleChange = (event) => {
    const { id, checked } = event.target;
    setSelectedResiduos((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedItems = Object.keys(selectedResiduos)
      .filter((key) => selectedResiduos[key])
      .map((key) => {
        const residuo = residuos.find(r => r.id === key);
        return residuo ? { id: residuo.id, title: residuo.title, points: residuo.points } : null;
      })
      .filter(Boolean);

    const formData = {
      uf: selectedUf,
      city: selectedCity,
      location: selectedMap,
      residuos: selectedItems.length > 0 ? selectedItems : [],
    };

    console.log('Dados do formulário:', formData); 
    await store.addColeta(formData);
};

  const MapEvents = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setSelectedMap([lat, lng]);
      },
    });
    return null;
  };

  if (!initialsPositionMap) {
    return <div>Carregando sua localização...</div>;
  }

  return (
    <div className='w-full h-full min-h-[calc(100vh-80px)] py-5 pb-10 flex justify-center items-start'>
      <div className='w-full max-w-[1440px] flex justify-center p-4'>
        <form onSubmit={handleSubmit} className='w-full max-w-3xl bg-white p-6 rounded-xl'>
          <h1 className='text-5xl font-bold text-[#322153] mb-10'>Cadastro</h1>
          <h1 className='text-2xl font-bold text-[#322153] mb-4'>Endereço</h1>

          <div className='h-96 w-full mb-6'>
            <MapContainer 
              center={initialsPositionMap} 
              zoom={13} 
              className='h-full w-full'>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedMap}>
                <Popup>Um marcador no mapa.</Popup>
              </Marker>
              <MapEvents />
            </MapContainer>
          </div>
          
          <div className='flex gap-5 w-full justify-between'>
            <div className="flex w-full flex-col-reverse justify-center relative mb-5">
              <select
                value={selectedUf}
                onChange={handleSelectUf} 
                className='reset-select cursor-pointer h-14 bg-[#F0F0F5] w-full px-4 rounded-lg mt-1 outline-[#25db77] peer'>
                <option value="0">Selecion uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-4 top-11 pointer-events-none'/>
              <label htmlFor='uf' className='text-[#6C6C80] peer-focus:text-[#2f8556]'>Estado(UF)</label>
            </div>
            <div className="flex w-full flex-col-reverse justify-center relative mb-5">
              <select 
                onChange={handleSelectCity}
                value={selectedCity}
                className='reset-select cursor-pointer h-14 bg-[#F0F0F5] w-full px-4 rounded-lg mt-1 outline-[#25db77] peer'>
                <option value="">Cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-4 top-11'/>
              <label className='text-[#6C6C80] peer-focus:text-[#2f8556]'>Selecione uma cidade</label>
            </div>
          </div>

          <TitleSubtitle title="Itens de coleta" subtitle='Selecione os coletáveis'/>
          <CardResiduos selectedItems={selectedResiduos} onChange={handleChange} residuos={residuos} />

          <button type="submit" className='bg-[#34CB79] w-full mt-8 mb-2 flex justify-between items-center h-16 rounded-md text-white'>
            <div className='text-white px-8 w-full text-center'>
              Cadastrar Ponto de Coleta
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
