import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PerfilAlunoPage = ({ user }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir sua conta?');
    if (!confirm) return;

    try {
      await axios.delete(`/usuarios/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      alert('Erro ao excluir usuário.');
    }
  };

  const handleEdit = () => {
    navigate('/perfil/editar');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto bg-white border border-black rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Perfil do Aluno</h2>

        <div className="space-y-4 text-black">
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefone:</strong> {user.telefone}</p>
          <p><strong>Tipo de Acesso:</strong> {user.role}</p>
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={handleEdit}
            className="bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black transition"
          >
            Alterar Informações
          </button>
          <button
            onClick={handleDelete}
            className="bg-white text-black px-4 py-2 rounded border border-black hover:bg-black hover:text-white transition"
          >
            Excluir Conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilAlunoPage;
