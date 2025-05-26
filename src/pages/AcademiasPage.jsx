import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import SkeletonImagePlaceholder from '../components/skeletons/SkeletonImagePlaceholder';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const filtrosPadrao = {
  tipos: [],
  estruturas: [],
  servicos: []
};

const opcoesFiltro = {
  tipos: ['CONVENCIONAL', 'CROSSFIT'],
  estruturas: ['ACESSIBILIDADE', 'ESTACIONAMENTO', 'VESTIARIO', 'BEBEDOURO', 'ARMARIOS', 'AR_CONDICIONADO', 'WIFI'],
  servicos: ['AVALIACAO_INICIAL', 'NUTRICIONAL', 'PERSONAL', 'TREINOS', 'APP', 'WHATSAPP', 'VINTE_QUATRO_HORAS']
};

const AcademiasPage = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const navigate = useNavigate();
  const [academias, setAcademias] = useState([]);
  const [search, setSearch] = useState('');
  const [academiasExternas, setAcademiasExternas] = useState([]);
  const [filtros, setFiltros] = useState(filtrosPadrao);
  const [loading, setLoading] = useState(false);

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

  const buscarAcademiasExternas = async () => {
    try {
      const res = await api.get(`/academia/externas`, {
        params: { endereco: encodeURIComponent(search) }
      });
      console.log(res);
      setAcademiasExternas(res.data);
    } catch (e) {
      toast.error("Erro ao buscar academias externas", e);
      setAcademiasExternas([]);
    }
  };

  const buscarAcademias = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    Object.entries(filtros).forEach(([key, valores]) => {
      valores.forEach(v => params.append(key, v));
    });

    try {
      const res = await api.get(`/academia/filtro?${params.toString()}`);
      setAcademias(res.data);
    } catch {
      setAcademias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarAcademias();

    buscarAcademiasExternas();
  }, [search, filtros]);

  return (
    <>
      <section className="bg-black text-white py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Encontre uma Academia</h2>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-4">
            <input
              type="search"
              placeholder="Digite o nome ou cidade"
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

      <section className="py-16 px-6 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loading && (
            <div className='w-full col-span-full'>
              <SkeletonImagePlaceholder />
            </div>              
          )}

          {!loading && academias.length === 0 && academiasExternas.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhuma academia encontrada.</p>
          )}

          {!loading && academias.length > 0 && (
            <div className="col-span-full mb-4">
              <h3 className="text-2xl font-bold text-black">Academias Cadastradas</h3>
            </div>
          )}

          {!loading && academias.map((a, index) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 50, rotateX: -15, blur: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, blur: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-gray-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:rotate-[-1deg] cursor-pointer"
              onClick={() => navigate(`/academias/${a.id}`)}
            >
              <div className="group relative">
                <img
                  src={a.imagemUrl || '/assets/imagens/default-background.jpg'}
                  alt={a.nome}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition" />
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-extrabold mb-2 text-black tracking-tight">
                  {a.nome}
                </h3>
                <p className="text-sm text-gray-600">{a.endereco}</p>
              </div>
            </motion.div>
          ))}

          {!loading && academiasExternas.length > 0 && (
            <>
              <div className="col-span-full mt-10 mb-4">
                <h3 className="text-2xl font-bold text-black">Academias Externas</h3>
              </div>
              {academiasExternas.map((a, index) => (
                <motion.div
                  key={a.placeId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    src={
                      a.photoReference
                        ? `https://places.googleapis.com/v1/${a.photoReference}/media?maxWidthPx=800&key=${apiKey}`
                        : '/assets/imagens/academia1.jpg'
                    }
                    alt={a.nome}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => window.location.href = `/academias-externas/${a.placeId}`}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1 text-black">{a.nome}</h3>
                    <p className="text-sm text-gray-600 mb-1">{a.endereco}</p>
                    <p className="text-yellow-500 text-sm">⭐ {a.avaliacao} ({a.totalAvaliacoes})</p>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AcademiasPage;
