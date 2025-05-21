import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';
import { motion } from 'framer-motion';

const diaLabel = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo'
};

const PerfilAcademiaDetalhesPage = () => {
  const { id } = useParams();
  const [academia, setAcademia] = useState(null);

  useEffect(() => {
    api.get(`/academia/${id}`)
      .then(res => setAcademia(res.data))
      .catch(() => setAcademia(null));
  }, [id]);

  const handleDeletePlano = async (planoId) => {
    if (window.confirm('Tem certeza que deseja deletar este plano?')) {
      try {
        await api.delete(`/planos/${planoId}`);
        const res = await api.get(`/academia/${id}`);
        setAcademia(res.data);
      } catch {
        alert('Erro ao deletar plano.');
      }
    }
  };

  const handleDeleteAtividade = async (atividadeId) => {
    if (window.confirm('Tem certeza que deseja deletar esta atividade?')) {
      try {
        await api.delete(`/atividades/${atividadeId}`);
        const res = await api.get(`/academia/${id}`);
        setAcademia(res.data);
      } catch {
        alert('Erro ao deletar atividade.');
      }
    }
  };

  if (!academia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando detalhes da academia...</p>
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
                        <p className="font-medium">{a.nome}</p>
                        <p className="text-gray-500">{diaLabel[a.diaSemana] || a.diaSemana} - {a.horario}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Link
                            to={`/atividades/editar/${a.id}`}
                            className="text-sm border border-black text-black px-3 py-1 rounded hover:bg-black hover:text-white"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDeleteAtividade(a.id)}
                            className="text-sm border border-black text-black px-3 py-1 rounded hover:bg-black hover:text-white"
                          >
                            Deletar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6">
                <Link
                  to={`/planos/cadastrar?academiaId=${academia.id}`}
                  className="inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800 mr-3"
                >
                  Cadastrar Plano
                </Link>
                <Link
                  to={`/atividades/cadastrar?academiaId=${academia.id}`}
                  className="inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                >
                  Cadastrar Atividade
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Planos */}
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
                    <div className="flex justify-between gap-2 mt-4">
                      <Link
                        to={`/planos/editar/${p.id}`}
                        className="border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeletePlano(p.id)}
                        className="border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PerfilAcademiaDetalhesPage;
