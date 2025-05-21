import React from 'react';

const CardTreino = ({ titulo, categoria, autor, imagem, onClick }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <img
        src={imagem}
        alt={`Imagem do treino ${titulo}`}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-bold">{titulo}</h3>
      <p className="text-sm text-gray-700">Categoria: {categoria}</p>
      <p className="text-sm text-gray-500">Autor: {autor}</p>
      <button
        onClick={onClick}
        className="mt-3 text-blue-600 hover:underline"
      >
        Ver detalhes
      </button>
    </div>
  );
};

export default CardTreino;
