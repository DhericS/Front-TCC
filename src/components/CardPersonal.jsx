import React from 'react';

const CardPersonal = ({ nome, especialidade, cidade, imagem, onClick }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <img
        src={imagem}
        alt={`Foto de ${nome}`}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-bold">{nome}</h3>
      <p className="text-sm text-gray-700">{especialidade}</p>
      <p className="text-sm text-gray-500">{cidade}</p>
      <button
        className="mt-3 text-blue-600 hover:underline"
        onClick={onClick}
      >
        Ver perfil
      </button>
    </div>
  );
};

export default CardPersonal;
