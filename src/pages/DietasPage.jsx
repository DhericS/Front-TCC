import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const filtrosPadrao = {
  tipos: []
};

const opcoesFiltro = {
  tipos: ['BULKING', 'CUTTING']
};

export default function DietasPage() {
  const [dietas, setDietas] = useState([]);
  const [search, setSearch] = useState('');
  const [filtros, setFiltros] = useState(filtrosPadrao);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckbox = (categoria, valor) => {
    setFiltros(prev => {
      const atual = prev[categoria];
      return {
        ...prev,
        [categoria]: atual.includes(valor)
          ? atual.filter(item => item !== valor)
          : [...atual, valor]
      };
    });
  };

  const buscarDietas = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    filtros.tipos.forEach(tipo => params.append('tipos', tipo)); // envia múltiplos 'tipos'

    try {
      const res = await axios.get(`/dieta/filtro?${params.toString()}`);
      setDietas(res.data);
    } catch (err) {
      setError('Erro ao carregar dietas.');
      setDietas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDietas();
  }, []);

  return (
    <>
      <section className="bg-black text-white py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Encontre uma Dieta</h2>

          <form onSubmit={buscarDietas} className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-4">
            <input
              type="search"
              placeholder="Digite o título ou descrição"
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
            {Object.entries(opcoesFiltro).map(([categoria, opcoes]) => (
              <div key={categoria} className="min-w-[10rem]">
                <h4 className="font-bold mb-2 uppercase text-sm">{categoria}</h4>
                {opcoes.map(opcao => (
                  <label key={opcao} className="block text-white text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filtros[categoria].includes(opcao)}
                      onChange={() => handleCheckbox(categoria, opcao)}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de dietas */}
      <section className="py-16 px-6 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loading && (
            <p className="col-span-full text-center text-gray-500">Carregando dietas...</p>
          )}

          {!loading && dietas.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhuma dieta encontrada.</p>
          )}

          {!loading && dietas.map((dieta, index) => (
            <motion.div
              key={dieta.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/dietas/${dieta.id}`)}
            >
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1 text-black">{dieta.titulo}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{dieta.descricao}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Calorias:</strong> {dieta.calorias || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong>Tipo:</strong> {dieta.tipoDieta || 'N/A'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
