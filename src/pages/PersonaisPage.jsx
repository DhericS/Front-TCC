import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
      const res = await axios.get('/usuarios?tipoUsuario=personal');
      if (Array.isArray(res.data)) {
        const filtrados = res.data.filter(p =>
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
      <section className="bg-black text-white py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Encontre um Personal Trainer</h2>

          <form onSubmit={(e) => e.preventDefault()} className="flex justify-center gap-2 max-w-4xl mx-auto">
            <input
              type="search"
              placeholder="Digite o nome ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow min-w-[250px] px-4 py-2 rounded text-black"
            />
          </form>
        </div>
      </section>

      <section className="py-16 px-6 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loading && (
            <p className="col-span-full text-center text-gray-500">Carregando personais...</p>
          )}

          {!loading && error && (
            <p className="col-span-full text-center text-red-500">{error}</p>
          )}

          {!loading && personais.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhum personal encontrado.</p>
          )}

          {!loading && personais.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/personais/${p.id}`)}
            >
              <img
                src={p.imagemUrl || '/assets/imagens/personal-default.jpg'}
                alt={p.nome}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1 text-black">{p.nome}</h3>
                <p className="text-sm text-gray-600 mb-1">{p.cref}</p>
                <p className="text-sm text-gray-600">{p.email}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
