import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import CardResiduos from './CardResiduos';
import TitleSubtitle from './TitleSubtitle';

export default function FormVisita() {
  return (
    <form className='w-full'>
         <TitleSubtitle
         title='Selecione resíduos para descarte'
         subtitle='Conforme os itens selecionados o mapa mostrará quais pontos estão disponíveis para coleta deste item.'
         />

        <CardResiduos/>

        <TitleSubtitle
         title='Seleciona o ponto para visita'
         subtitle='Conforme os itens selecionados acima, o mapa mostrará quais pontos estão disponíveis.'
         />
        <div className='h-96 w-full my-6'>
            <MapContainer 
            center={[51.505, -0.09]} 
            zoom={13} 
            className='h-full w-full'>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>Um marcador no mapa.</Popup>
              </Marker>
            </MapContainer>
        </div>
    </form>
  )
}
