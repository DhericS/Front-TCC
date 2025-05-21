import React from 'react';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';
import CardPersonal from '../components/CardPersonal';

const personaisMock = [
  {
    id: 1,
    nome: 'Bruno Oliveira',
    especialidade: 'Crossfit e Funcional',
    cidade: 'Rio de Janeiro - RJ',
    imagem: '/assets/imagens/personal1.jpg',
  },
  {
    id: 2,
    nome: 'Juliana Santos',
    especialidade: 'Musculação e Treino Feminino',
    cidade: 'São Paulo - SP',
    imagem: '/assets/imagens/personal2.jpg',
  },
];

const PersonaisPage = () => {
  return (
    <>

      <section className="bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center mb-6">
          <h1 className="text-2xl font-bold mb-4">Encontre o Personal Ideal</h1>
          <p className="text-sm text-gray-600">{personaisMock.length} personal trainers encontrados</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {personaisMock.map((personal) => (
            <CardPersonal
              key={personal.id}
              {...personal}
              onClick={() => console.log('Ver perfil de:', personal.nome)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default PersonaisPage;
