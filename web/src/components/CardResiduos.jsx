import React from 'react';

export default function CardResiduos({ residuos, selectedItems, onChange }) {
  return (
    <div className="grid grid-cols-6 max-md:grid-cols-3 max-sm:grid-cols-2 mt-6 gap-4">
      {residuos.map((residuo) => (
        <div key={residuo.id} className="relative flex items-center justify-center">
          <input 
            type="checkbox" 
            id={residuo.id} 
            className="peer hidden"
            checked={selectedItems[residuo.id] || false}
            onChange={onChange}
          />
          <label 
            htmlFor={residuo.id} 
            className="flex flex-col items-center justify-center border-4 border-gray-200 rounded-lg p-4 w-full h-32 cursor-pointer bg-[#ffffff] transition-all duration-300 peer-checked:border-green-500 peer-checked:bg-green-100"
          >
            <img src={residuo.img} className='w-12' alt={residuo.title} />
            <span className="text-gray-700 text-center font-semibold mt-2 leading-5">
              {residuo.title}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}
