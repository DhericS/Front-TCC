import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';
import { toast } from 'sonner';
import api from '../services/api';

const filtrosPadrao = { tipos: [] };

const opcoesFiltro = {
  tipos: ['MUSCULACAO', 'FUNCIONAL', 'CROSSFIT', 'CALISTENIA', 'HIIT']
};

const TreinosPage = () => {
  const [treinos, setTreinos] = useState([]);
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

  const buscarTreinos = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    filtros.tipos.forEach(tipo => params.append('tipos', tipo));

    try {
      const res = await api.get(`/treino/filtro?${params.toString()}`);
      const data = res.data;
      setTreinos(Array.isArray(data) ? data : []);
      setPaginaAtual(1); // reinicia paginação ao buscar
    } catch {
      toast.error('Erro ao buscar treinos!');
      setTreinos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTreinos();
  }, [search, filtros]);

  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;
  const treinosPaginados = treinos.slice(indexInicio, indexFim);

  return (
    <>
      <section className="bg-black text-white py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Encontre um Treino</h2>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-4">
            <input
              type="search"
              placeholder="Digite o nome ou parte do treino"
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
                      checked={(filtros[categoria] || []).includes(opcao)}
                      onChange={() => handleCheckbox(categoria, opcao)}
                    />
                    {opcao.charAt(0).toUpperCase() + opcao.slice(1).toLowerCase()}
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

          {!loading && treinos.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhum treino encontrado.</p>
          )}

          {!loading && treinosPaginados.map((treino, index) => (
            <motion.div
              key={treino.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer p-4"
              onClick={() => navigate(`/treinos/${treino.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={e => { if (e.key === 'Enter') navigate(`/treinos/${treino.id}`); }}
            >
              <h3 className="text-xl font-bold mb-1 text-black">{treino.nome}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{treino.descricao}</p>
            </motion.div>
          ))}
        </div>

        {!loading && treinos.length > itensPorPagina && (
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
                  p * itensPorPagina < treinos.length ? p + 1 : p
                )
              }
              disabled={paginaAtual * itensPorPagina >= treinos.length}
              className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default TreinosPage;
