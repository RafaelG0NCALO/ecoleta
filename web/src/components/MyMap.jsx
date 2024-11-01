import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MyMap = () => {
  const [selectedMap, setSelectedMap] = useState(null); // Inicialmente nulo
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setSelectedMap([latitude, longitude]); // Atualiza o estado com a localização atual
            setLoading(false); // Carregamento concluído
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
            setLoading(false); // Mesmo em caso de erro, finaliza o carregamento
          }
        );
      } else {
        console.error("Geolocalização não é suportada neste navegador.");
        setLoading(false); // Finaliza o carregamento se a geolocalização não for suportada
      }
    };

    getLocation();
  }, []); // Executa apenas uma vez ao montar o componente

  const MapEvents = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        setSelectedMap([lat, lng]); // Atualiza a posição do marcador
      },
    });

    return null;
  };

  if (loading) {
    return <div>Carregando mapa...</div>; // Mensagem de carregamento
  }

  if (!selectedMap) {
    return <div>Erro ao obter localização.</div>; // Mensagem de erro caso a localização não seja obtida
  }

  return (
    <MapContainer 
      center={selectedMap} 
      zoom={13} 
      className='h-full w-full'
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={selectedMap}>
        <Popup>Você está aqui!</Popup>
      </Marker>
      <MapEvents />
    </MapContainer>
  );
};

export default MyMap;
