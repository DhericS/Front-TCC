import React, { useEffect, useRef, useState } from 'react';
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
  estruturas: ['ACESSIBILIDADE', 'ESTACIONAMENTO', 'VESTIARIO', 'BEBEDOURO', 'ARMARIOS', 'AR_CONDICIONADO', 'WIFI']
};

const AcademiasPage = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const navigate = useNavigate();

  const [academias, setAcademias] = useState([]);
  const [search, setSearch] = useState('');
  const [finalSearch, setFinalSearch] = useState('');
  const [academiasExternas, setAcademiasExternas] = useState([]);
  const [filtros, setFiltros] = useState(filtrosPadrao);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [paginaExterna, setPaginaExterna] = useState(1);
  const itensPorPagina = 12;

  const inputRef = useRef(null);

  useEffect(() => {
    const loadAutocomplete = () => {
      if (!window.google || !window.google.maps || !inputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'br' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          setSearch(place.formatted_address);
          setFinalSearch(place.formatted_address);
        }
      });
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = loadAutocomplete;
      document.head.appendChild(script);
    } else {
      loadAutocomplete();
    }
  }, [apiKey]);

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
        params: { endereco: finalSearch }
      });
      setAcademiasExternas(res.data);
    } catch (e) {
      toast.error("Erro ao buscar academias externas", e);
      setAcademiasExternas([]);
    }
  };

  const buscarAcademias = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, valores]) => {
      valores.forEach(v => params.append(key, v));
    });

    try {
      const res = await api.get(`/academia/filtro?${params.toString()}`);
      let lista = res.data;

      if (finalSearch.trim() !== '') {
        const termo = finalSearch.toLowerCase();
        lista = lista.filter(a =>
          a.endereco?.toLowerCase().includes(termo) ||
          a.nome?.toLowerCase().includes(termo)
        );
      }

      setAcademias(lista);
    } catch {
      setAcademias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPaginaAtual(1);
    setPaginaExterna(1);
    buscarAcademias();
    if (finalSearch.length > 0) {
      buscarAcademiasExternas();
    }
  }, [finalSearch, filtros]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const termo = e.target.search.value.trim();
    setFinalSearch(termo);
  };

  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;
  const academiasPaginadas = academias.slice(indexInicio, indexFim);

  const indexInicioExt = (paginaExterna - 1) * itensPorPagina;
  const indexFimExt = indexInicioExt + itensPorPagina;
  const academiasExternasPaginadas = academiasExternas.slice(indexInicioExt, indexFimExt);

  return (
    <>
      {/* ... conteúdo da barra de busca e filtros permanece o mesmo ... */}

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
              <h3 className="text-2xl font-bold text-black">Academias</h3>
            </div>
          )}

          {!loading && academiasPaginadas.map((a, index) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-gray-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
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

          {!loading && academias.length > itensPorPagina && (
            <div className="col-span-full flex justify-center mt-6 gap-2">
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
                    p * itensPorPagina < academias.length ? p + 1 : p
                  )
                }
                disabled={paginaAtual * itensPorPagina >= academias.length}
                className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}

          {!loading && academiasExternasPaginadas.length > 0 && (
            <>
              {academiasExternasPaginadas.map((a, index) => (
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
                        : '/assets/imagens/default-background.jpg'
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

              {academiasExternas.length > itensPorPagina && (
                <div className="col-span-full flex justify-center mt-6 gap-2">
                  <button
                    onClick={() => setPaginaExterna(p => Math.max(p - 1, 1))}
                    disabled={paginaExterna === 1}
                    className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-black font-bold">
                    Página {paginaExterna}
                  </span>
                  <button
                    onClick={() =>
                      setPaginaExterna(p =>
                        p * itensPorPagina < academiasExternas.length ? p + 1 : p
                      )
                    }
                    disabled={paginaExterna * itensPorPagina >= academiasExternas.length}
                    className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AcademiasPage;
