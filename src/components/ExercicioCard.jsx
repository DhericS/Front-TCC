import React from 'react';

const ExercicioCard = ({ exercicio }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <img
        src={exercicio.imagemUrl || '/assets/imagens/default-exercise.jpg'}
        alt={exercicio.nome}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h4 className="font-semibold text-lg mb-2">{exercicio.nome}</h4>
      <p className="text-gray-700">Séries: {exercicio.series}</p>
      <p className="text-gray-700">Repetições: {exercicio.repeticoes}</p>
      <p className="text-gray-700">Grupo muscular: {exercicio.grupoMuscular}</p>
    </div>
  );
};

export default ExercicioCard;
