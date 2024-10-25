import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userStore from '../stores/userStore';
import { CheckCircle, Coins, Copy, Lock, Unlock } from 'lucide-react';

const GiftList = ({ onClaim }) => { 
  const { user, fetchUserProfile } = userStore();
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGifts = async () => {
    try {
      const response = await axios.get('/premios');
      setGifts(response.data);
    } catch (err) {
      setError('Erro ao buscar prêmios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const claimGift = async (giftId) => {
    try {
      const response = await axios.post('/resgatar', { userId: user._id, giftId });
      const { codigo } = response.data;
      console.log('Prêmio resgatado com sucesso! Código: ' + codigo);
      await fetchUserProfile(); 
      onClaim();
      fetchGifts();
    } catch (error) {
      console.error('Erro ao resgatar prêmio:', error);
      alert('Erro ao resgatar prêmio: ' + (error.response ? error.response.data.error : 'Erro desconhecido.'));
    }
  };

  const checkIfGiftClaimed = (giftId) => {
    return user.prizes.some(prize => prize.prizeId.toString() === giftId.toString());
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  if (loading) return <p>Carregando prêmios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='grid py-6 grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4'>
      {gifts.map((gift) => {
        const isClaimed = checkIfGiftClaimed(gift._id);
        const progressPercent = !isClaimed ? Math.min((user.pontos / gift.custo) * 100, 100) : '100'
        const isUnlocked = user.pontos >= gift.custo;
        return (
          <div key={gift._id} className="overflow-hidden rounded-2xl mb-4">
            <img 
              src={gift.imagemUrl} 
              className='w-full' 
              alt="Gift Card"
            />
            <div className='px-3 w-full p-4 bg-white'>
              <h1 className='text-xl font-bold text-[#322153]'>
                {gift.nome}
              </h1>
              <div className='flex justify-between'>
              <p className='font-bold flex gap-2 text-[#165733]'>
                {isClaimed ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle /> Resgatado
                  </span>
                ) : isUnlocked ? (
                  <span className="flex items-center gap-2">
                    <Unlock /> Liberado
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock /> Bloqueado
                  </span>
                )}
              </p>
                <div className='flex gap-2 my-3 text-[#165733] font-semibold justify-between'>
                  <Coins/> 
                  {gift.custo} 
                </div>
              </div>
              
              <div className='w-full h-2 bg-gray-100  my-2 rounded-full'>
                <div  style={{ width: `${progressPercent}%` }} className='bg-[#34CB79] w-1/4 h-full rounded-full'></div>
              </div>
              
              {isClaimed ? (
                <p className='w-full bg-[#34CB79] h-12 rounded-md flex items-center justify-center text-white'>
                  <span className='truncate w-[85%]'>
                    {user.prizes.find(prize => prize.prizeId.toString() === gift._id.toString()).codigo}
                  </span>
                  <Copy size={20}/>
                </p>
              ) : (
                <button 
                  className='bg-[#34CB79] px-2 w-full flex justify-center overflow-hidden items-center h-12 rounded-md text-white'
                  onClick={() => claimGift(gift._id)} // Passa o ID do prêmio para a função
                >
                  Pegar 
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GiftList;
