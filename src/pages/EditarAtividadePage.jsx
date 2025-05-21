import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';

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
      await api.put(`/atividades/${id}`, form);
      alert('Atividade atualizada com sucesso.');
      navigate(`/academias/${form.academiaId}`);
    } catch (error) {
      alert('Erro ao atualizar atividade.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Deseja realmente excluir esta atividade?')) {
      try {
        await api.delete(`/atividades/${id}`);
        alert('Atividade excluída com sucesso.');
        navigate(`/academias/${form.academiaId}`);
      } catch {
        alert('Erro ao deletar atividade.');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
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
              <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="border border-black text-black px-6 py-2 rounded hover:bg-black hover:text-white"
              >
                Deletar
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditarAtividadePage;
