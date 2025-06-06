import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';
import { toast } from 'sonner';
import api from '../services/api';

const EditarPerfilPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useGetUser();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    tipoUsuario: '',
    cref: '',
    cnpj: ''
  });

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
      senha: '',
      tipoUsuario: user.tipoUsuario || '',
      cref: user.tipoUsuario === 'PERSONAL' ? user.cref || '' : '',
      cnpj: user.tipoUsuario === 'USERACADADMIN' ? user.cnpj || '' : ''
    });
  }, [loading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: user.id,
      tipoUsuario: form.tipoUsuario,
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      senha: form.senha
    };

    if (form.tipoUsuario === 'PERSONAL') payload.cref = form.cref;
    if (form.tipoUsuario === 'USERACADADMIN') payload.cnpj = form.cnpj;

    try {
      await api.put('/usuarios/atualizar', payload, {
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {form.tipoUsuario === 'PERSONAL' && (
            <div>
              <label className="block font-semibold">CREF</label>
              <input
                type="text"
                name="cref"
                value={form.cref}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          )}

          {form.tipoUsuario === 'USERACADADMIN' && (
            <div>
              <label className="block font-semibold">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-semibold">Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md border border-black hover:bg-white hover:text-black transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilPage;
