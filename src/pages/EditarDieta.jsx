import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';

const EditarDieta = () => {
  const { id } = useParams(); // ID da dieta passado pela rota
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    calorias: '',
    objetivo: '',
    tipoDieta: '',
    userAcadId: '',
    personalId: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchDieta = async () => {
    setLoading(true);  
    try {
        const res = await axios.get(`http://backend.guidesfit.com.br/dieta/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setForm(res.data);
      } catch (err) {
        toast.error('Erro ao carregar dados da dieta');
        navigate('/dieta');
      } finally {
        setLoading(false);
      }
    };

    fetchDieta();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      await axios.put(`http://backend.guidesfit.com.br/dieta/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Dieta atualizada com sucesso!');
      navigate('/perfil'); // redireciona após salvar
    } catch (err) {
      toast.error('Erro ao atualizar dieta');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 mt-6">Editar Dieta</h1>

        {!loading ? (

            <form onSubmit={handleSubmit} className="mt-12 w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold text-black mb-6">Editar Dieta</h3>

            <div className="mb-4">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                type="text"
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black"
                rows={4}
                required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="calorias" className="block text-sm font-medium text-gray-700 mb-1">Calorias</label>
                <input
                type="number"
                id="calorias"
                name="calorias"
                min="0"
                value={form.calorias}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                <select
                id="objetivo"
                name="objetivo"
                value={form.objetivo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
                >
                <option value="">Selecione</option>
                <option value="BULKING">Bulking (Ganho de peso)</option>
                <option value="CUTTING">Cutting (Perda de peso)</option>
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="tipoDieta" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Dieta</label>
                <select
                id="tipoDieta"
                name="tipoDieta"
                value={form.tipoDieta}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
                >
                <option value="">Selecione</option>
                <option value="BULKING">Bulking</option>
                <option value="CUTTING">Cutting</option>
                </select>
            </div>

            <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-white hover:text-black border border-black transition"
                disabled={loadingSubmit}
            >
                {loadingSubmit ? 'Salvando...' : 'Atualizar Dieta'}
            </button>
            </form>
        ) : (
            <p>Carregando...</p>
        )}
    </div>
  );
};

export default EditarDieta;
