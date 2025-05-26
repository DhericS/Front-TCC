import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avaliacoes from '../components/Avaliacoes';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../services/api';
import { useGetUser } from '../hooks/useGetUser';
import Reviews from '../components/Reviews';
import NewReview from '../components/NewReview';
import ReviewsDynamic from '../components/ReviewsDynamic';

export default function DetalhesPersonalPage() {
  const { id } = useParams();
  const [personal, setPersonal] = useState(null);
  const { user, loading: loadingUser } = useGetUser();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchPersonal = async () => {
      if (!id) {
        toast.error('ID do personal não fornecido.');
        navigation('/personais');
        return;
      }

      try {
        const res = await api.get(`/usuarios/${id}`);
        if (res.data) {
          setPersonal(res.data);
        } else {
          toast.error('Personal não encontrado.');
          navigation('/personais');
        }
      } catch (error) {
        console.error('Erro ao buscar personal:', error);
        toast.error('Erro ao buscar personal.');
        navigation('/personais');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonal();
  }, [id, navigation]);

  if (loading) {
    return (
      <div className="text-center py-10 flex justify-center">
        <SkeletonParagraphs />
      </div>
    );
  }

  const telefoneFormatado = personal?.telefone?.replace(/[^\d]/g, '');
  const mensagem = encodeURIComponent(
    `Olá ${personal?.nome}, vi seu perfil no nosso app e gostaria de saber mais sobre seus treinos!`
  );
  const whatsappUrl = telefoneFormatado ? `https://wa.me/55${telefoneFormatado}?text=${mensagem}` : null;

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8"
      >
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={personal?.imagemUrl || '/assets/imagens/default-background.jpg'}
              alt={personal?.nome}
              className="w-full sm:w-64 h-64 object-cover rounded-2xl shadow"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{personal?.nome}</h1>
            <p className="text-lg text-gray-700 mb-1">
              <strong className="text-gray-900">CREF:</strong> {personal?.cref || 'Não informado'}
            </p>
            <p className="text-lg text-gray-700 mb-1">
              <strong className="text-gray-900">Email:</strong> {personal?.email}
            </p>
            <p className="text-lg text-gray-700 mb-1">
              <strong className="text-gray-900">Telefone:</strong> {personal?.telefone || 'Não informado'}
            </p>
            <p className="text-yellow-500 font-semibold text-lg mt-2">
              ⭐ {personal?.avaliacao?.toFixed(1) || '0.0'}
              <span className="text-sm text-gray-600"> ({personal?.totalAvaliacoes || 0} avaliações)</span>
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 shadow-md transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-5 h-5"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.866 7.866 0 0 0 8 0C3.58 0 0 3.58 0 8a7.966 7.966 0 0 0 1.147 4.14L0 16l3.967-1.04A7.959 7.959 0 0 0 8 16c4.42 0 8-3.58 8-8a7.966 7.966 0 0 0-2.399-5.674zM8 14.5a6.475 6.475 0 0 1-3.482-.974l-.249-.149-2.352.616.627-2.291-.162-.256A6.471 6.471 0 0 1 1.5 8a6.5 6.5 0 1 1 6.5 6.5zm3.638-4.68c-.197-.098-1.168-.577-1.35-.642-.181-.065-.314-.098-.446.098s-.512.642-.627.775c-.115.131-.23.147-.427.049-.197-.098-.831-.306-1.583-.977-.585-.52-.98-1.16-1.096-1.357-.115-.196-.012-.301.086-.398.088-.088.197-.23.295-.345.098-.115.131-.197.197-.328.065-.131.033-.246-.016-.345-.049-.098-.446-1.077-.611-1.473-.161-.387-.326-.335-.446-.342l-.38-.007c-.131 0-.345.049-.527.246s-.691.676-.691 1.646.708 1.91.807 2.042c.098.131 1.395 2.131 3.383 2.988.473.204.841.326 1.128.416.474.151.905.13 1.246.079.38-.056 1.168-.478 1.334-.941.164-.461.164-.856.115-.941-.049-.082-.18-.131-.38-.23z" />
                </svg>
                Falar no WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="mt-12">
          {personal?.id ? (
            <div className='flex flex-col gap-4'>
              {loadingUser ? (
                <div className="text-center py-10 flex justify-center">
                  <SkeletonParagraphs />
                </div>
              ) : (
                <ReviewsDynamic
                  user={user}
                  entidadeId={personal?.id}
                  tipoEntidade={'PERSONAL'}
                />
              )}
              
              {user && (
                <NewReview 
                  entidadeId={personal?.id}
                  tipoEntidade={'PERSONAL'}
                  user={user}
                />
              )}
            </div>
          ) : (
            <p>Carregando avaliações...</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
