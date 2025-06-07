import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';

const filtrosPadrao = { tipos: [] };

const opcoesFiltro = {
  tipos: ['BULKING', 'CUTTING']
};

export default function DietasPage() {
  const [dietas, setDietas] = useState([]);
  const [search, setSearch] = useState('');
  const [filtros, setFiltros] = useState(filtrosPadrao);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 9;
  const navigate = useNavigate();

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

  const buscarDietas = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    filtros.tipos.forEach(tipo => params.append('tipos', tipo));

    try {
      const res = await api.get(`/dieta/filtro?${params.toString()}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setDietas(data);
      setPaginaAtual(1); // reinicia paginação a cada busca
    } catch {
      setDietas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDietas();
  }, [search, filtros]);

  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;
  const dietasPaginadas = dietas.slice(indexInicio, indexFim);

  return (
    <>
      <section className="bg-black text-white py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Encontre uma Dieta</h2>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-4">
            <input
              type="search"
              placeholder="Digite o título ou descrição"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow min-w-[250px] px-4 py-2 rounded text-black"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto text-left">
            {Object.entries(opcoesFiltro).map(([categoria, opcoes]) => (
              <div key={categoria} className="min-w-[10rem]">
                <h4 className="font-bold mb-2 uppercase text-sm">{categoria}</h4>
                {opcoes.map(opcao => (
                  <label key={opcao} className="block text-white text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filtros[categoria]?.includes(opcao)}
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

      <section className="py-16 px-6 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-full flex justify-center">
              <SkeletonParagraphs />
            </div>
          )}

          {!loading && dietas.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhuma dieta encontrada.</p>
          )}

          {!loading && dietasPaginadas.map((dieta, index) => (
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

        {!loading && dietas.length > itensPorPagina && (
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}
              disabled={paginaAtual === 1}
              className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="px-4 py-2 text-black font-bold">
              Página {paginaAtual}
            </span>

            <button
              onClick={() =>
                setPaginaAtual(p =>
                  p * itensPorPagina < dietas.length ? p + 1 : p
                )
              }
              disabled={paginaAtual * itensPorPagina >= dietas.length}
              className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </section>
    </>
  );
}
