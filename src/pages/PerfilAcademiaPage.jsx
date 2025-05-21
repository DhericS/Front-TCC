import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PerfilAcademiaPage = ({ user }) => {
  const navigate = useNavigate();
  const [academias, setAcademias] = useState([]);

  useEffect(() => {
    axios.get('/academias', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => setAcademias(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleDeleteUser = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir sua conta?');
    if (!confirm) return;
    try {
      await axios.delete(`/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch {
      alert('Erro ao excluir conta.');
    }
  };

  const handleDeleteAcademia = async (id) => {
    const confirm = window.confirm('Excluir academia?');
    if (!confirm) return;
    try {
      await axios.delete(`/academias/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAcademias(academias.filter(a => a.id !== id));
    } catch {
      alert('Erro ao excluir academia.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto bg-white border border-black rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Perfil - Estabelecimento</h2>

        <div className="space-y-4 text-black mb-6">
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefone:</strong> {user.telefone}</p>
          <p><strong>Tipo de Acesso:</strong> {user.role}</p>
        </div>

        <div className="flex gap-4 justify-center mb-10">
          <button onClick={() => navigate('/perfil/editar')} className="bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black transition">Alterar Informações</button>
          <button onClick={handleDeleteUser} className="bg-white text-black px-4 py-2 rounded border border-black hover:bg-black hover:text-white transition">Excluir Conta</button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Gerenciar Academias</h3>
          <button onClick={() => navigate('/cadastrar-academia')} className="bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black transition">Cadastrar Academia</button>
        </div>

        {academias.length === 0 ? (
          <p className="text-gray-600">Sem academias cadastradas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academias.map(gym => (
              <div key={gym.id} className="border border-black rounded-lg p-4">
                <h4 className="font-bold text-lg mb-2">{gym.nome}</h4>
                <p className="mb-2">{gym.endereco}</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/academias/${gym.id}`)} className="text-sm px-3 py-1 border border-black rounded hover:bg-black hover:text-white">Ver Detalhes</button>
                  <button onClick={() => handleDeleteAcademia(gym.id)} className="text-sm px-3 py-1 border border-black rounded hover:bg-black hover:text-white">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilAcademiaPage;
