import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';

const CadastrarPlanoPage = () => {
  const [searchParams] = useSearchParams();
  const academiaId = searchParams.get('academiaId');
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '' });
  const [academia, setAcademia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (academiaId) {
      api.get(`/academia/${academiaId}`)
        .then(res => setAcademia(res.data))
        .catch(() => setAcademia(null))
        .finally(() => setLoading(false));
    }
  }, [academiaId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/planos`, {
        ...form,
        academiaId: Number(academiaId)
      });
      navigate(`/academias/${academiaId}`);
    } catch (error) {
      alert('Erro ao cadastrar plano.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando detalhes da academia...</p>
      </div>
    );
  }

  if (!academia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar academia.</p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Cadastrar novo plano para {academia.nome}</h2>
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
            <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
              Salvar Plano
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default CadastrarPlanoPage;
