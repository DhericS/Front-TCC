import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';

const EditarPlanoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '' });
  const [loading, setLoading] = useState(true);
  const [plano, setPlano] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    api.get(`/planos/${id}`)
      .then(res => {
        setForm({
          nome: res.data.nome || '',
          descricao: res.data.descricao || '',
          preco: res.data.preco || ''
        });
        setPlano(res.data);
      })
      .catch(() => alert('Erro ao carregar plano.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      await api.put(`/planos/${id}`, {
        ...form,
        academiaId: plano.academiaId || plano.academia_id
      });
      toast.success('Plano atualizado com sucesso.');
      navigate(-1);
    } catch (error) {
      toast.error('Erro ao atualizar plano.');
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
          <h2 className="text-2xl font-bold mb-6 text-center">Editar plano</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome do plano"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
            <textarea
              name="descricao"
              placeholder="Descrição"
              value={form.descricao}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            ></textarea>
            <input
              type="number"
              name="preco"
              placeholder="Preço em R$"
              value={form.preco}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
            <div className="flex justify-between">
              <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50" disabled={loadingSubmit}>
                {loadingSubmit ? 'Atualizando...' : 'Atualizar'}
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

export default EditarPlanoPage;
