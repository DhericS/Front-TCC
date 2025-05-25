import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';
import api from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PersonaisPage() {
  const [personais, setPersonais] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const buscarPersonais = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/usuarios?tipoUsuario=personal');
      if (Array.isArray(res.data)) {
        const filtrados = res.data.filter((p) =>
          p.nome.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase())
        );
        setPersonais(filtrados);
      } else {
        throw new Error('Resposta inesperada da API');
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError('Erro ao carregar personais.');
      setPersonais([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPersonais();
  }, [search]);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-black to-zinc-900 text-white py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6">Encontre um Personal Trainer</h2>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex justify-center gap-4 max-w-4xl mx-auto"
          >
            <input
              type="search"
              placeholder="Digite o nome ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow min-w-[250px] px-4 py-3 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </form>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex justify-center h-screen">
              <SkeletonParagraphs />
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-red-500 mb-8">{error}</p>
          )}

          {!loading && personais.length === 0 && (
            <p className="text-center text-gray-500 mb-8">Nenhum personal encontrado.</p>
          )}

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {!loading && personais.map((p) => (
              <motion.div
                key={p.id}
                variants={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  localStorage.setItem('searchPersonalEmail', p.email);	
                  navigate(`/personais/${p.id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <img
                  src={p.imagemUrl || '/assets/imagens/default-background.jpg'}
                  alt={p.nome}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black mb-1">{p.nome}</h3>
                  <p className="text-sm text-gray-600 mb-1">{p.cref}</p>
                  <p className="text-sm text-gray-600">{p.email}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
