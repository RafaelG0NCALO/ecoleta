import React from 'react'
import pessoinhas from '../assets/pessoinhas.png'
import { CornerDownRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CollectionPointsMap from '../components/teste'

export default function Home() {
  return (
    <>
    <div className='w-full h-full min-h-[calc(100vh-80px)] flex justify-center items-center'>
        <div className='w-full max-w-[1440px] items-center justify-between max-md:justify-center flex max-md:flex-wrap-reverse p-4'>
            <div className='w-full max-w-[500px] px-2'>
                <h1 className='font-bold text-5xl text-[#322153] mt-3'>Seu marketplace de coleta de resíduos.</h1>
                <p className='text-2xl text-[#6C6C80] my-6'>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                <Link to='/cadastro-de-usuario' className='bg-[#34CB79] w-full mb-3 max-w-80 max-md:max-w-full flex justify-between overflow-hidden items-center h-16 rounded-md text-white'>
                    <div className='h-16 min-w-16 bg-[#2FB86E] flex items-center justify-center'>
                    <CornerDownRight />
                    </div> 
                    <div className='text-white px-8 w-full text-center'>
                    Descartar resíduos
                    </div>
                </Link>
                <Link to='/cadastro-de-local' className='bg-[#9470e8] w-full mb-3 max-w-80 max-md:max-w-full flex justify-between overflow-hidden items-center h-16 rounded-md text-white'>
                    <div className='h-16 min-w-16 bg-[#8566cd] flex items-center justify-center'>
                    <CornerDownRight /> 
                    </div> 
                    <div className='text-white px-8 w-full text-center'>
                    Ponto de coleta
                    </div>
                </Link>
            </div>
            <div className='relative'>
                <img src={pessoinhas} className='w-full max-w-[700px] max-h-[650px] object-contain' />
            </div>
        </div>
    </div>
    </>
  )
}
