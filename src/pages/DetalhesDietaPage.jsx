import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';
import api from '../services/api';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';
import NewReview from '../components/NewReview';
import ReviewsDynamic from '../components/ReviewsDynamic';

export default function DetalhesDietaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dieta, setDieta] = useState(null);
  const { user, loading: loadingUsuario } = useGetUser();

  useEffect(() => {
    api.get(`/dieta/${id}`)
      .then(res => setDieta(res.data))
      .catch(() => setDieta(null));
  }, [id]);

  if (!dieta) {
    return (
      <div className='w-full flex justify-center mt-6'>
        <SkeletonParagraphs />
      </div>
    );
  };

  if (loadingUsuario) {
    return (
      <div className='w-full flex justify-center mt-6'>
        <SkeletonParagraphs />
      </div>
    );
  }

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
            {dieta.nomeUsuario || 'N/A'}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="inline-block bg-black hover:bg-gray-800 transition text-white font-semibold px-6 py-3 rounded-md"
      >
        Voltar
      </button>

      <div className='flex flex-col gap-3'>
        {loadingUsuario ? (
          <div className="text-center py-10 flex justify-center">
            <SkeletonParagraphs />
          </div>
        ) : (
          <ReviewsDynamic
            user={user}
            entidadeId={dieta?.id}
            tipoEntidade={'DIETA'}
          />
        )}
        {user && (
          <NewReview 
            entidadeId={dieta.id}
            tipoEntidade={'DIETA'}
            user={user}
          />
        )}
      </div>
    </div>
  );
}
