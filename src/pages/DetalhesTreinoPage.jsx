import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';
import Avaliacoes from '../components/Avaliacoes';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';
import Reviews from '../components/Reviews';
import NewReview from '../components/NewReview';
import { toast } from 'sonner';
import api from '../services/api';
import ReviewsDynamic from '../components/ReviewsDynamic';

const gruposMuscularesLabels = {
  PEITO: 'Peito',
  COSTA: 'Costas',
  PERNAS: 'Pernas',
  BRACOS: 'Braços',
  OMBROS: 'Ombros',
};

const DetalhesTreinoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [treino, setTreino] = useState(null);
  const { user, loading: loadingUsuario } = useGetUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreino = async () => {
      try {
        const res = await api.get(`/treino/${id}`);
        setTreino(res.data);
      } catch (err) {
        toast.error('Erro ao carregar treino.');
        navigate('/treinos');
      } finally {
        setLoading(false);
      }
    };
    fetchTreino();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-6">
        <SkeletonParagraphs />
      </div>
    )
  }

  if (!treino) return <div className="p-8 text-center text-red-600">Treino não encontrado.</div>;

  if (loadingUsuario) {
    return (
      <div className="w-full flex justify-center mt-6">
        <SkeletonParagraphs />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-gray-900">{treino.nome}</h1>
          <p className="text-gray-700 text-lg whitespace-pre-line">{treino.descricao}</p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Exercícios</h2>
          {treino.exercicios.length === 0 ? (
            <p className="text-gray-600 italic">Nenhum exercício cadastrado para este treino.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {treino.exercicios.map((exercicio) => (
                <div
                  key={exercicio.id}
                  className="bg-white border rounded-lg shadow overflow-hidden"
                >
                  <img
                    src={exercicio.imagemUrl || '/assets/imagens/default-background.jpg'}
                    alt={exercicio.nome}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{exercicio.nome}</h3>
                    <p className="text-gray-700 mb-1">Séries: {exercicio.series}</p>
                    <p className="text-gray-700 mb-1">Repetições: {exercicio.repeticoes}</p>
                    <p className="text-gray-700">
                      Grupo muscular: {gruposMuscularesLabels[exercicio.grupoMuscular] || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link
          to="/treinos"
          className="inline-block mt-10 text-black font-semibold underline hover:no-underline"
        >
          ← Voltar para lista de treinos
        </Link>

        <div className='flex flex-col gap-3'>
          <ReviewsDynamic
            user={user}
            entidadeId={treino.id}
            tipoEntidade={'TREINO'}
          />
          {user && (
            <NewReview 
              entidadeId={treino.id}
              tipoEntidade={'TREINO'}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesTreinoPage;
