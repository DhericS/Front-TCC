import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalDialog from '../components/ModalDialog';
import { toast } from 'sonner';
import api from '../services/api';

const PerfilAcademiaPage = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [academias, setAcademias] = useState([]);
  const [isModalDeleteUserIsOpen, setIsModalDeleteUserIsOpen] = useState(false);
  const [isModalDeleteAcademiaIsOpen, setIsModalDeleteAcademiaIsOpen] = useState(false);
  const [selectedAcademia, setSelectedAcademia] = useState(null);
  const [handleLoading, setHandleLoading] = useState(false);

  useEffect(() => {
    const fetchAcademias = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/academia?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAcademias(res.data);
      } catch (error) {
        console.error('Erro ao buscar academias:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAcademias();
  }, []);

  const handleDeleteUser = async () => {
    try {
      setHandleLoading(true);
      await axios.delete(`/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch {
      toast.error('Erro ao excluir conta.');
    } finally {
      setIsModalDeleteUserIsOpen(false);
      setHandleLoading(false);
    }
  };

  const handleDeleteAcademia = async (id) => {
    try {
      setHandleLoading(true);
      await api.delete(`/academia/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
      });
      setAcademias(prev => prev.filter((item) => item.id !== id));
      toast.success('Academia excluída com sucesso.');
    } catch {
      toast.error('Erro ao excluir academia.');
    } finally {
      setHandleLoading(false);
      setIsModalDeleteAcademiaIsOpen(false);
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
          <button onClick={() => setIsModalDeleteUserIsOpen(true)} className="bg-white text-black px-4 py-2 rounded border border-black hover:bg-black hover:text-white transition">Excluir Conta</button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Gerenciar Academias</h3>
          <button onClick={() => navigate('/cadastrar-academia')} className="bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black transition">Cadastrar Academia</button>
        </div>

        {loading ? (
          <p className="text-center mt-10">Carregando academias...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academias.map(gym => (
              <div key={gym.id} className="border border-black rounded-lg p-4">
                <h4 className="font-bold text-lg mb-2">{gym.nome}</h4>
                <p className="mb-2">{gym.endereco}</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/academias/${gym.id}/editar`)} className="text-sm px-3 py-1 border border-black rounded hover:bg-black hover:text-white">Ver Detalhes</button>
                  <button onClick={() => {
                    setSelectedAcademia(gym.id);
                    setIsModalDeleteAcademiaIsOpen(true);
                  }} className="text-sm px-3 py-1 border border-black rounded hover:bg-black hover:text-white">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ModalDialog
        isOpen={isModalDeleteUserIsOpen}
        onClose={() => setIsModalDeleteUserIsOpen(false)}
        title="Deletar Usuario"
        onConfirm={() => handleDeleteUser()}
        description="Tem certeza que deseja deletar o usuario? Esta ação não pode ser desfeita."
        loading={handleLoading}
      />
      <ModalDialog
        isOpen={isModalDeleteAcademiaIsOpen}
        onClose={() => setIsModalDeleteAcademiaIsOpen(false)}
        title="Deletar Academia"
        onConfirm={() => handleDeleteAcademia(selectedAcademia)}
        description="Tem certeza que deseja deletar a Academia? Esta ação não pode ser desfeita."
        loading={handleLoading}
      />
    </div>
  );
};

export default PerfilAcademiaPage;
