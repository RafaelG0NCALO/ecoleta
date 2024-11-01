import React, { useState } from 'react';
import CardResiduos from './CardResiduos';
import Bateria from '../assets/Baterias.png';
import Lampadas from '../assets/Lampadas.png';
import Eletronicos from '../assets/Eletronicos.png';
import Oleos from '../assets/Oleo.png';
import Organicos from '../assets/Organicos.png';
import Papel from '../assets/Papel.png';

const residuos = [
  { id: 'item1', title: 'Pilhas e Baterias', img: Bateria, points: 250 },
  { id: 'item2', title: 'Lâmpadas', img: Lampadas, points: 150 },
  { id: 'item3', title: 'Eletrônicos', img: Eletronicos, points: 200 },
  { id: 'item4', title: 'Óleo', img: Oleos, points: 100 },
  { id: 'item5', title: 'Orgânicos', img: Organicos, points: 120 },
  { id: 'item6', title: 'Papéis e Papelão', img: Papel, points: 160 },
];

export default function FormComponent() {
  const [selectedItems, setSelectedItems] = useState({});

  const handleChange = (event) => {
    const { id, checked } = event.target;
    setSelectedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedResiduos = Object.keys(selectedItems)
      .filter((key) => selectedItems[key])
      .map((key) => {
        const residuo = residuos.find(r => r.id === key);
        return residuo ? { id: residuo.id, title: residuo.title, points: residuo.points } : null;
      })
      .filter(Boolean);

    console.log(selectedResiduos);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardResiduos selectedItems={selectedItems} onChange={handleChange} residuos={residuos} />
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Enviar</button>
    </form>
  );
}
