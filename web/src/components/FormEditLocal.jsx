import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CardResiduos from './CardResiduos';
import Bateria from '../assets/Baterias.png';
import Lampadas from '../assets/Lampadas.png';
import Eletronicos from '../assets/Eletronicos.png';
import Oleos from '../assets/Oleo.png';
import Organicos from '../assets/Organicos.png';
import Papel from '../assets/Papel.png';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { ChevronDown } from 'lucide-react';
import localStore from '../stores/localStore';

const residuosData = [
    { id: 'item1', title: 'Pilhas e Baterias', img: Bateria, points: 250 },
    { id: 'item2', title: 'Lâmpadas', img: Lampadas, points: 150 },
    { id: 'item3', title: 'Eletrônicos', img: Eletronicos, points: 200 },
    { id: 'item4', title: 'Óleo', img: Oleos, points: 100 },
    { id: 'item5', title: 'Orgânicos', img: Organicos, points: 120 },
    { id: 'item6', title: 'Papéis e Papelão', img: Papel, points: 160 },
];

export default function FormEditLocal() {
    const [ufs, setUfs] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [cities, setCities] = useState([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [location, setLocation] = useState([0, 0]); 
    const [selectedMap, setSelectedMap] = useState([0, 0]); 
    const { local } = localStore();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/profile-user-local', { 
                    withCredentials: true 
                });
                const userData = response.data.local;

                if (userData && userData.local && userData.local[0]) {
                    const userResiduos = userData.local[0].residuos;
                    const userLocation = userData.local[0].location;  // Coordenadas (latitude, longitude)
                    const userUf = userData.local[0].uf; // Estado (UF)
                    const userCity = userData.local[0].city; // Cidade
                    
                    setLocation(userLocation);  // Atualiza o estado com as coordenadas do banco
                    setSelectedUf(userUf); // Define a UF do usuário
                    setSelectedCity(userCity); // Define a cidade do usuário
                    setSelectedMap(userLocation); // Atualiza a localização selecionada para o mapa

                    const initialSelectedItems = {};
                    userResiduos.forEach(residuo => {
                        initialSelectedItems[residuo.id] = true; // Marca os resíduos como selecionados
                    });
                    setSelectedItems(initialSelectedItems);
                }

                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar dados do usuário:", err);
                setError('Erro ao carregar os dados.');
                setLoading(false);
            }
        };
        fetchUserData();
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

    const handleCheckboxChange = (e) => {
        const { id, checked } = e.target;
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [id]: checked,
        }));
    };

    const generateData = () => {
        const residuos = residuosData.filter(residuo => selectedItems[residuo.id]).map(residuo => ({
            id: residuo.id,
            title: residuo.title,
            points: residuo.points
        }));
        return {
            local: [
                {
                    city: selectedCity,
                    location: selectedMap,
                    residuos: residuos,
                    uf: selectedUf
                }
            ]
        };
    };

    const handleSave = async () => {
        const data = generateData(); 
        const userId = local._id;  
        console.log("Dados gerados para envio:", data);
        try {
            const response = await axios.put(`/edit-profile-user-local/${userId}`, data, {
                withCredentials: true 
            });
            console.log('Dados salvos com sucesso:', response.data);
            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados. Tente novamente!');
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const MapEvents = () => {
        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng;
                setSelectedMap([lat, lng]); 
            },
        });
        return null;
    };

    return (
        <div className='bg-white p-6 rounded-lg mt-10'>
            <CardResiduos
                residuos={residuosData}
                selectedItems={selectedItems}
                onChange={handleCheckboxChange}
            />

            <div className="h-96 w-full my-6">
                <MapContainer
                    center={location} // Usando a localização inicial do banco
                    zoom={13}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
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
                        <option value="0">Selecione uma UF</option>
                        {ufs.map((uf) => (
                            <option key={uf} value={uf}>
                                {uf}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className='absolute right-4 top-11 pointer-events-none' />
                    <label htmlFor='uf' className='text-[#6C6C80] peer-focus:text-[#2f8556]'>Estado (UF)</label>
                </div>

                <div className="flex w-full flex-col-reverse justify-center relative mb-5">
                    <select
                        onChange={handleSelectCity}
                        value={selectedCity}
                        className='reset-select cursor-pointer h-14 bg-[#F0F0F5] w-full px-4 rounded-lg mt-1 outline-[#25db77] peer'>
                        <option value="">Selecione uma cidade</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className='absolute right-4 top-11' />
                    <label className='text-[#6C6C80] peer-focus:text-[#2f8556]'>Cidade</label>
                </div>

            </div>

            <button 
            onClick={handleSave} 
            type="button" 
            disabled={isSaving}
            className='bg-[#34CB79] w-full mt-8 mb-2 flex justify-between items-center h-16 rounded-md text-white'>
                <div className='text-white px-8 w-full text-center'>
                {isSaving ? 'Salvando...' : 'Salvar dados'}
                </div>
            </button>
        </div>
    );
}
