import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';
import { toast } from 'sonner';
import api from '../services/api';

const EditarPerfilPage = () => {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const { user, loading } = useGetUser();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', tipoUsuario: '', senha: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setForm({
      nome: user.nome || '',
      email: user.email || '',
      telefone: user.telefone || '',
      tipoUsuario: user.tipoUsuario || ''
    });
  }, [loading]);

  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/usuarios/atualizar`, {
        ...form,
        tipoUsuario: user.tipoUsuario,
        id: user.id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Perfil atualizado com sucesso.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-xl mx-auto bg-white border border-black rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Editar Perfil</h2>

        {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm mb-4">Perfil atualizado com sucesso!</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nome</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
          </div>

          <div>
            <label className="block font-semibold">Telefone</label>
            <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label className="block font-semibold">Senha</label>
            <input type="password" name="senha" value={form.senha} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
          </div>

          <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md border border-black hover:bg-white hover:text-black transition disabled:opacity-50" disabled={loading}>
            {loading ? 'Carregando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilPage;
