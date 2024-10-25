import 'leaflet/dist/leaflet.css'; // Importando o CSS necessário para o Leaflet
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function FormCreateLocal() {
    return (
        <div className='w-full h-full min-h-[calc(100vh-80px)] py-5 pb-10 flex justify-center items-start'>
          <div className='w-full max-w-[1440px] items-center justify-center flex p-4'>
            <form className='w-full max-w-3xl bg-white p-6 rounded-xl'>
              <h1 className='text-5xl font-bold text-[#322153] mb-10'>Cadastro</h1>
              <h1 className='text-2xl font-bold text-[#322153] mb-4'>Endereço</h1>
    
              <div className='h-96 w-full mb-6'>
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
              
              <div className='flex gap-5 w-full justify-between'>
                <div className="flex w-full flex-col-reverse justify-center relative mb-5">
                    <select className='reset-select cursor-pointer h-14 bg-[#F0F0F5] w-full px-4 rounded-lg mt-1 outline-[#25db77] peer'>
                        <option selected>Cidade</option>
                        <option value="US">item 1</option>
                        <option value="CA">item 2</option>
                        <option value="FR">item 3</option>
                    </select>
                    <ChevronDown className='absolute right-4 top-11'/>
                    <label className='text-[#6C6C80] peer-focus:text-[#2f8556]'>
                        Select an option
                    </label>
                </div>
                <div className="flex w-full flex-col-reverse justify-center relative mb-5">
                    <select className='reset-select cursor-pointer h-14 bg-[#F0F0F5] w-full px-4 rounded-lg mt-1 outline-[#25db77] peer'>
                        <option selected>Estado</option>
                        <option value="US">item 1</option>
                        <option value="CA">item 2</option>
                        <option value="FR">item 3</option>
                    </select>
                    <ChevronDown className='absolute right-4 top-11'/>
                    <label className='text-[#6C6C80] peer-focus:text-[#2f8556]'>
                        Select an option
                    </label>
                </div>
              </div>
    
              <button className='bg-[#34CB79] w-full mt-8 mb-2 flex justify-between overflow-hidden items-center h-16 rounded-md text-white'>
                <div className='text-white px-8 w-full text-center'>
                    Cadastrar Usuário
                </div>
              </button>
    
            </form>
          </div>
        </div>
      );
}
