import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import Avaliacoes from '../components/Avaliacoes';
import { useGetUser } from '../hooks/useGetUser';

const diaLabel = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo'
};

const DetalhesAcademiaPage = () => {
  const { id } = useParams();
  const [academia, setAcademia] = useState(null);
  const { user, loading: loadingUser } = useGetUser();

  useEffect(() => {
    api.get(`/academia/${id}`)
      .then(res => setAcademia(res.data))
      .catch(() => setAcademia(null));
  }, [id]);

  if (!academia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando detalhes da academia...</p>
      </div>
    );
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando usuário...</p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <img
              src={academia.imagemUrl || '/assets/imagens/academia1.jpg'}
              alt={academia.nome}
              className="w-full h-64 object-cover rounded shadow"
            />
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{academia.nome}</h2>
                <p className="text-gray-600 mb-4">{academia.endereco}</p>
                <p className="text-gray-700 mb-4">{academia.descricao}</p>
                <span className="inline-block bg-black text-white text-sm px-3 py-1 rounded-full">
                  {academia.tipo}
                </span>
              </div>

              {academia.atividades && academia.atividades.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">Atividades</h3>
                  <ul className="space-y-2 text-sm">
                    {academia.atividades.map((a, index) => (
                      <li key={index} className="bg-gray-100 p-2 rounded shadow">
                        <p className="font-medium">{diaLabel[a.diaSemana] || a.diaSemana} - {a.horario}</p>
                        <p className="text-gray-500">{a.nome}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {academia.planos && academia.planos.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Planos disponíveis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {academia.planos.map((p) => (
                  <div key={p.id} className="border p-4 rounded shadow flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold">{p.nome}</h4>
                      <p className="text-gray-700">{p.descricao}</p>
                      <p className="text-3xl font-extrabold">
                        R$ {typeof p.preco === 'number' ? p.preco.toFixed(2) : 'Preço inválido'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Avaliacoes
            entidadeId={academia.id}
            tipoEntidade="ACADEMIA"
            usuarioLogadoId={user?.id}
          />
        </div>
      </section>
    </>
  );
};

export default DetalhesAcademiaPage;
