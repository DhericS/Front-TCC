import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';
import { useGetUser } from '../hooks/useGetUser';
import NewReview from '../components/NewReview';
import Reviews from '../components/Reviews';

const diaLabel = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const DetalhesAcademiaPage = () => {
  const { id } = useParams();
  const [academia, setAcademia] = useState(null);
  const { user } = useGetUser();

  useEffect(() => {
    const fetchAcademia = async () => {
      try {
        const res = await api.get(`/academia/${id}`);
        setAcademia(res.data);
      } catch (error) {
        setAcademia(null);
      }
    };

    fetchAcademia();
  }, [id]);

  if (!academia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonParagraphs />
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-white to-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          <motion.img
            variants={item}
            src={academia.imagemUrl || '/assets/imagens/default-background.jpg'}
            alt={academia.nome}
            className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-xl"
          />
          <motion.div variants={item} className="flex flex-col gap-4">
            <h2 className="text-4xl font-extrabold text-black">{academia.nome}</h2>
            <p className="text-gray-600">
              {academia.endereco}
              <strong className='ml-4'><a href={`https://www.google.com.br/maps/search/${academia.endereco}`} target='_blank' rel='norepper'>Ver no Mapa</a></strong>  
            </p>
            <p className="text-gray-700">{academia.descricao}</p>
            <span className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full w-fit">
              {academia.tipoAcad}
            </span>
          </motion.div>
        </motion.div>

        {/* Atividades */}
        {academia.atividades?.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-16"
          >
            <h3 className="text-2xl font-bold mb-6">Atividades</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {academia.atividades.map((a, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white rounded-2xl p-5 shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
                >
                  <p className="text-black font-semibold">
                    {diaLabel[a.diaSemana] || a.diaSemana} - {a.horario}
                  </p>
                  <p className="text-gray-600">{a.nome}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Planos */}
        {academia.planos?.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-20"
          >
            <h3 className="text-2xl font-bold mb-6">Planos disponíveis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {academia.planos.map((p) => (
                <motion.div
                  key={p.id}
                  variants={item}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:scale-105 hover:shadow-2xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-lg font-bold mb-2">{p.nome}</h4>
                    <p className="text-gray-600 mb-4">{p.descricao}</p>
                  </div>
                  <p className="text-3xl font-extrabold text-black">
                    R$ {typeof p.preco === 'number' ? p.preco.toFixed(2) : '---'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        <div className='mt-7 flex flex-col gap-4'>
          <Reviews 
            entidadeId={academia.id}
            tipoEntidade={'ACADEMIA'}
          />
          <NewReview 
            user={user}
            entidadeId={academia.id}
            tipoEntidade={'ACADEMIA'}
          />
        </div>
      </div>
    </section>
  );
};

export default DetalhesAcademiaPage;
