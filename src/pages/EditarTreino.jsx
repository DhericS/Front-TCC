import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditarTreino = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreino = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await api.get(`/treino/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            });
            setForm(res.data);
            setExercicios(res.data.exercicios)
        } catch (err) {
            toast.error('Erro ao carregar dados do treino');
        } finally {
            setLoading(false);
        }
    }

    fetchTreino();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExercicioChange = (index, field, value) => {
    const updated = [...exercicios];
    updated[index][field] = value;
    setExercicios(updated);
  };

  const adicionarExercicio = () => {
    setExercicios([...exercicios, { nome: '', series: '', repeticoes: '', grupoMuscular: '' }]);
  };

  const removerExercicio = (index) => {
    const updated = [...exercicios];
    updated.splice(index, 1);
    setExercicios(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoadingSubmit(true);

    try {
      await axios.put(`https://backend.guidesfit.com.br/treino/${id}`, {
        ...form,
        exercicios: exercicios,
        personalId: form.personal.id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Treino atualizado com sucesso!');
      navigate('/perfil');
    //   onSubmit?.({ ...form, exercicios });
    } catch (err) {
      toast.error('Erro ao atualizar treino');
      console.log(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 mt-6">Editar Dieta</h1>

        {!loading ? (
            <form onSubmit={handleSubmit} className="mt-12 w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-semibold text-black mb-6">Editar Treino</h3>

            <div className="mb-4">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Título do Treino</label>
                <input
                type="text"
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
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
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                required
                />
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-semibold text-black mb-4">Exercícios</h4>
                {exercicios.map((ex, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-medium">Nome do Exercício</label>
                        <input
                          type="text"
                          name="nome"
                          value={ex.nome}
                          onChange={(e) => handleExercicioChange(index, 'nome', e.target.value)}
                          required
                          className="w-full border rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Séries</label>
                        <input
                          type="number"
                          name="series"
                          value={ex.series}
                          onChange={(e) => handleExercicioChange(index, 'series', e.target.value)}
                          required
                          className="w-full border rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Repetições</label>
                        <input
                          type="number"
                          name="repeticoes"
                          value={ex.repeticoes}
                          onChange={(e) => handleExercicioChange(index, 'repeticoes', e.target.value)}
                          required
                          className="w-full border rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Grupo Muscular</label>
                        <select
                          name="grupoMuscular"
                          value={ex.grupoMuscular}
                          onChange={(e) => handleExercicioChange(index, 'grupoMuscular', e.target.value)}
                          required
                          className="w-full border rounded p-2"
                        >
                          <option value="">Selecione</option>
                          <option value="PEITO">Peito</option>
                          <option value="COSTAS">Costas</option>
                          <option value="PERNA">Perna</option>
                          <option value="OMBRO">Ombro</option>
                          <option value="BÍCEPS">Bíceps</option>
                          <option value="TRÍCEPS">Tríceps</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerExercicio(index)}
                      className="btnDeleteExercicio bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition disabled:opacity-50"
                      disabled={loadingSubmit}
                    >
                      Deletar
                    </button>
                  </div>
                ))}

                <button
                type="button"
                onClick={adicionarExercicio}
                className="px-4 py-2 mt-2 border border-black rounded-md text-black hover:bg-black hover:text-white transition disabled:opacity-50"
                disabled={loadingSubmit}
                >
                Adicionar Exercício
                </button>
            </div>

            <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-white hover:text-black border border-black transition disabled:opacity-50"
                disabled={loadingSubmit}
            >
                {loadingSubmit ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            </form>
        ) : (
            <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                <span className="ml-2 text-gray-700">Carregando...</span>
            </div>
        )}
    </div>
  );
};

export default EditarTreino;
