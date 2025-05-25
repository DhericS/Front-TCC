import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useGetUser } from '../hooks/useGetUser';
import { toast } from 'sonner';

const CadastrarAcademiaPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useGetUser();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    tipoAcad: '',
    imagemUrl: ''  
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/academia/upload-imagem-temp', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, imagemUrl: res.data.url }));
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      toast.error('Erro ao carregar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      await api.post('/academia', {
        ...form,
        id: user.id,
        planos: [],
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate(-1);
      toast.success('Academia cadastrada com sucesso.');
    } catch (error) {
      toast.error('Erro ao cadastrar academia.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastrar Nova Academia</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome da academia"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="endereco"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
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

          {/* Upload de imagem */}
          <div>
            <label className="block mb-2 font-semibold">Imagem da Academia</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              disabled={uploadingImage}
            />
            {form.imagemUrl && (
              <img
                src={form.imagemUrl}
                alt="Preview"
                className="mt-2 w-48 h-32 object-cover rounded"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={loading || loadingSubmit || uploadingImage}
          >
            {loading || loadingSubmit ? 'Carregando...' : 'Cadastrar Academia'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CadastrarAcademiaPage;
