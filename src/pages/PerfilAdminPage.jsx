import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PerfilAdminPage = ({ user }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir sua conta?');
    if (!confirm) return;

    try {
      await axios.delete(`/usuarios/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          userType: user.tipoUsuario
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white p-8">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Lado esquerdo: saudação */}
        <div className="bg-black text-white p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">Olá, {user.nome?.split(' ')[0]} 👋</h2>
          <p className="text-lg text-gray-300">Esse é o seu painel de administrador.</p>
        </div>

        {/* Lado direito: dados e ações */}
        <div className="p-10">
          <h3 className="text-2xl font-semibold text-black mb-6 text-center">Dados do Perfil</h3>

          <div className="space-y-4 text-sm text-gray-700">
            <p><span className="font-semibold">Nome:</span> {user.nome}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Telefone:</span> {user.telefone}</p>
            <p><span className="font-semibold">Tipo de Acesso:</span> {user.tipoUsuario?.toUpperCase()}</p>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button
              onClick={handleEdit}
              className="w-full md:w-auto bg-black text-white px-5 py-2 rounded-md hover:bg-white hover:text-black border border-black transition"
            >
              Alterar Informações
            </button>
            <button
              onClick={handleDelete}
              className="w-full md:w-auto bg-white text-black px-5 py-2 rounded-md hover:bg-black hover:text-white border border-black transition"
            >
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilAdminPage;
