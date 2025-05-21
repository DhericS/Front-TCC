import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function DetalhesDietaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dieta, setDieta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDieta = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/dieta/${id}`);
      setDieta(response.data);
    } catch (err) {
      setError('Erro ao carregar detalhes da dieta.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDieta();
  }, [id]);

  if (loading)
    return <p className="p-6 text-center text-gray-600">Carregando dieta...</p>;
  if (error)
    return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!dieta)
    return <p className="p-6 text-center text-gray-600">Dieta não encontrada.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">{dieta.titulo}</h1>
      
      <p className="mb-8 text-gray-700 leading-relaxed">{dieta.descricao}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div className="bg-blue-50 p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Calorias</h3>
          <p className="text-gray-900 text-xl">{dieta.calorias ?? 'N/A'}</p>
        </div>

        <div className="bg-green-50 p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Objetivo</h3>
          <p className="text-gray-900 text-xl">{dieta.objetivo ?? 'N/A'}</p>
        </div>

        <div className="bg-yellow-50 p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">Tipo de Dieta</h3>
          <p className="text-gray-900 text-xl">{dieta.tipoDieta ?? 'N/A'}</p>
        </div>

        <div className="bg-purple-50 p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Autor</h3>
          <p className="text-gray-900 text-xl">
            {dieta.userAcad?.usuario?.nome || dieta.personal?.usuario?.nome || 'N/A'}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="inline-block bg-black hover:bg-gray-800 transition text-white font-semibold px-6 py-3 rounded-md"
        >
        Voltar
      </button>

    </div>
  );
}
