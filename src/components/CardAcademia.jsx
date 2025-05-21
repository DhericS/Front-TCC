import React from 'react';

const CardAcademia = ({ imagem, nome, endereco, onClick }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <img
        src={imagem}
        alt={nome}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-bold">{nome}</h3>
      <p className="text-sm text-gray-600">{endereco}</p>
      <button
        className="mt-3 text-blue-600 hover:underline"
        onClick={onClick}
      >
        Saber mais
      </button>
    </div>
  );
};

export default CardAcademia;
