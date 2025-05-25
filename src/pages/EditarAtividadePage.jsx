import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';
import SkeletonDefault from '../components/skeletons/SkeletonDefault';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';
import { toast } from 'sonner';

const diasSemana = [
  'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'
];

const horariosDisponiveis = [
  '08:00 - 09:00',
  '18:00 - 19:00',
  '20:00 - 21:00'
];

const EditarAtividadePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: '', diaSemana: '', horario: '', academiaId: null });
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    api.get(`/atividades/${id}`)
      .then(res => {
        console.log('🔍 Dados recebidos da API:', res.data); 
        setForm({
          nome: res.data.nome,
          diaSemana: res.data.diaSemana,
          horario: res.data.horario,
          academiaId: res.data.academiaId
        });
      })
      .catch(() => alert('Erro ao carregar atividade.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      await api.put(`/atividades/${id}`, form);
      toast.success('Atividade atualizada com sucesso.');
      navigate(`/academias/${form.academiaId}/editar`);
    } catch (error) {
      toast.error('Erro ao atualizar atividade.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><SkeletonParagraphs /></div>;
  }

  return (
    <>
      <section className="bg-white py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Editar Atividade</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome da atividade"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />

            <select
              name="diaSemana"
              value={form.diaSemana}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Selecione o dia da semana</option>
              {diasSemana.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>

            <select
              name="horario"
              value={form.horario}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Selecione o horário</option>
              {horariosDisponiveis.map(horario => (
                <option key={horario} value={horario}>{horario}</option>
              ))}
            </select>

            <div className="flex justify-between gap-2">
              <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50" disabled={loadingSubmit}>
                {loadingSubmit ? 'Atualizando...' : 'Atualizar Atividade'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={loadingSubmit}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditarAtividadePage;
