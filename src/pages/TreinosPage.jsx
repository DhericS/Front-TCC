import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CardTreino from '../components/CardTreino';

const Cardio = {
  CORRIDA: { nome: 'Esteira' },
  BICICLETA: { nome: 'Bicicleta ergométrica' },
  ESCADA: { nome: 'Escada simuladora' },
  REMO: { nome: 'Simulador de remo' },
  ELIPTICO: { nome: 'Elíptico' },
};

const Hipertrofia_Performace = {
  PESO_LIVRE: { nome: 'Área de peso livre' },
  MAQUINAS: { nome: 'Máquinas de musculação' },
  SUPINO: { nome: 'Bancos de supino' },
  ANILHAS: { nome: 'Suporte para anilhas' },
  RACKS: { nome: 'Power racks' },
};

const Tipos = {
  MUSCULACAO: { nome: 'Musculação' },
  FUNCIONAL: { nome: 'Treinamento funcional' },
  CROSSFIT: { nome: 'CrossFit' },
  CALISTENIA: { nome: 'Calistenia' },
  HIIT: { nome: 'Treino HIIT' },
};

const filtrosPadrao = {
  cardio: [],
  hipertrofia: [],
  tipoTreino: [],
};

const TreinosPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filtros, setFiltros] = useState(filtrosPadrao);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckbox = (categoria, valor) => {
    setFiltros(prev => {
      const atual = prev[categoria] || [];
      return {
        ...prev,
        [categoria]: atual.includes(valor)
          ? atual.filter(item => item !== valor)
          : [...atual, valor]
      };
    });
  };

  const buscarTreinos = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    Object.entries(filtros).forEach(([key, valores]) => {
      valores.forEach(v => params.append(key, v));
    });

    try {
      const res = await axios.get(`/treino/filtro?${params.toString()}`);
      setTreinos(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTreinos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTreinos();
  }, []);

  const handleVerDetalhes = (treino) => {
    navigate(`/treinos/${treino.id}`);
  };

  return (
    <>
      <section className="bg-black text-white py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Encontre um Treino</h2>

          <form
            onSubmit={buscarTreinos}
            className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-4"
          >
            <input
              type="search"
              placeholder="Digite o nome ou parte do treino"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow min-w-[250px] px-4 py-2 rounded text-black"
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto text-left">
            <div className="min-w-[10rem]">
              <h4 className="font-bold mb-2 uppercase text-sm">Cardios</h4>
              {Object.entries(Cardio).map(([key, val]) => (
                <label key={key} className="block text-white text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filtros.cardio.includes(key)}
                    onChange={() => handleCheckbox('cardio', key)}
                  />
                  {val.nome}
                </label>
              ))}
            </div>

            <div className="min-w-[10rem]">
              <h4 className="font-bold mb-2 uppercase text-sm">Áreas de Hipertrofia</h4>
              {Object.entries(Hipertrofia_Performace).map(([key, val]) => (
                <label key={key} className="block text-white text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filtros.hipertrofia.includes(key)}
                    onChange={() => handleCheckbox('hipertrofia', key)}
                  />
                  {val.nome}
                </label>
              ))}
            </div>

            <div className="min-w-[10rem]">
              <h4 className="font-bold mb-2 uppercase text-sm">Tipos de Treino</h4>
              {Object.entries(Tipos).map(([key, val]) => (
                <label key={key} className="block text-white text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filtros.tipoTreino.includes(key)}
                    onChange={() => handleCheckbox('tipoTreino', key)}
                  />
                  {val.nome}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loading && (
            <p className="col-span-full text-center text-gray-500">Carregando treinos...</p>
          )}

          {!loading && treinos.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhum treino encontrado.</p>
          )}

          {!loading && treinos.map((treino) => (
            <motion.div
              key={treino.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => handleVerDetalhes(treino)}
              role="button"
              tabIndex={0}
              onKeyPress={e => { if (e.key === 'Enter') handleVerDetalhes(treino); }}
            >
              <img
                src={treino.imagemUrl || '/assets/imagens/treino1.jpg'}
                alt={treino.nome}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{treino.nome}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{treino.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TreinosPage;
