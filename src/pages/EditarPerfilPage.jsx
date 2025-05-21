import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditarPerfilPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', tipoUsuario: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    axios.get('/usuarios/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        console.log("Resposta do /usuarios/me:", res.data);

        const { nome, email, telefone } = res.data;
        const tipoUsuario = res.data.tipoUsuario?.toLowerCase() || '';

        setForm({ nome, email, telefone, tipoUsuario });
        window.formDebug = { nome, email, telefone, tipoUsuario };
        console.log("formDebug no window:", window.formDebug);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    console.log("Enviando update com payload:", form);

    try {
      await axios.put('/usuarios/atualizar', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSucesso(true);
      setTimeout(() => navigate('/perfil'), 1500);
    } catch (err) {
      setErro('Erro ao atualizar perfil.');
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

          <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md border border-black hover:bg-white hover:text-black transition">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilPage;
