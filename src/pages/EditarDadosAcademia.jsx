import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';

const EditarDadosAcademia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    descricao: '',
    tipoAcad: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchAcademia = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/academia/${id}`);
        setForm({
          nome: res.data.nome,
          endereco: res.data.endereco,
          descricao: res.data.descricao,
          tipoAcad: res.data.tipoAcad,
          telefone: res.data.telefone
        });
      } catch (error) {
        toast.error('Erro ao carregar dados da academia');
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    fetchAcademia();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      await api.put(`/academia/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Dados da academia atualizados com sucesso!');
      navigate(`/academias/${id}/editar`);
    } catch {
      toast.error('Erro ao atualizar os dados');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Editar Dados da Academia</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">Endereço</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows="4"
            required
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">Telefone</label>
          <input
            type="text"
            name="telefone"
            placeholder="11999999999"
            maxLength={11} 
            pattern="\d{11}"
            value={form.telefone}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Tipo de Academia</label>
          <select
            name="tipoAcad"
            value={form.tipoAcad}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Selecione o tipo de academia</option>
            <option value="CROSSFIT">Crossfit</option>
            <option value="CONVENCIONAL">Convencional</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
            disabled={loading || loadingSubmit}
          >
            {loadingSubmit ? 'Carregando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white disabled:opacity-50"
            disabled={loading || loadingSubmit}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditarDadosAcademia;
