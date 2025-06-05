
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalDialog from '../components/ModalDialog';
import { toast } from 'sonner';
import api from '../services/api';

const PerfilAcademiaPage = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [academia, setAcademia] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [isModalDeleteUserIsOpen, setIsModalDeleteUserIsOpen] = useState(false);
  const [isModalDeleteAcademiaIsOpen, setIsModalDeleteAcademiaIsOpen] = useState(false);
  const [selectedAcademia, setSelectedAcademia] = useState(null);
  const [handleLoading, setHandleLoading] = useState(false);

  useEffect(() => {
    const fetchAcademia = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/usuarios/${user.id}/academia`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAcademia(res.data);
      } catch (error) {
        if (error.response && error.response.status === 204) {
          setAcademia(null);
        } else {
          toast.error('Erro ao buscar academia');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAcademia();
  }, [user.id]);

  useEffect(() => {
    const fetchPlanosEAtividades = async () => {
      if (!academia?.id) return;

      try {
        const token = localStorage.getItem('token');
        const [resPlanos, resAtividades] = await Promise.all([
          api.get(`/planos/academia/${academia.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`/atividades/academia/${academia.id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setPlanos(resPlanos.data);
        setAtividades(resAtividades.data);
      } catch {
        toast.error('Erro ao carregar planos e atividades');
      }
    };

    if (academia?.id) fetchPlanosEAtividades();
  }, [academia]);

  const handleDeleteUser = async () => {
    try {
      setHandleLoading(true);
      await api.delete(`/usuarios/${user.id}`, {
        params: { userType: 'useracadadmin' },
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAcademia(null);
      toast.success('Academia excluída com sucesso.');
    } catch {
      toast.error('Erro ao excluir academia.');
    } finally {
      setHandleLoading(false);
      setIsModalDeleteAcademiaIsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto bg-gray-100 border border-gray-300 rounded-2xl p-8 shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">Perfil - Estabelecimento</h2>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-10">
          <h3 className="text-xl font-semibold mb-4">Informações do Usuário</h3>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-semibold">Nome:</span> {user.nome}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Telefone:</span> {user.telefone}</p>
            <p><span className="font-semibold">Tipo de Acesso:</span> {user.role}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button onClick={() => navigate('/perfil/editar')} className="flex-1 bg-black text-white px-4 py-2 rounded-lg border border-black hover:bg-white hover:text-black transition">
              Alterar Informações
            </button>
            <button onClick={() => setIsModalDeleteUserIsOpen(true)} className="flex-1 bg-white text-black px-4 py-2 rounded-lg border border-black hover:bg-black hover:text-white transition">
              Excluir Conta
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Gerenciar Academia</h3>
          {!academia && (
            <button onClick={() => navigate('/cadastrar-academia')} className="bg-black text-white px-4 py-2 rounded-lg border border-black hover:bg-white hover:text-black transition">
              Cadastrar Academia
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Carregando academia...</p>
        ) : academia ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="p-5">
                <h4 className="font-bold text-lg mb-2">{academia.nome}</h4>
                <p className="text-sm text-gray-600 mb-4">{academia.endereco}</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/academias/${academia.id}/editar`)} className="flex-1 text-sm px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition">
                    Ver Detalhes
                  </button>
                  <button onClick={() => { setSelectedAcademia(academia.id); setIsModalDeleteAcademiaIsOpen(true); }} className="flex-1 text-sm px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition">
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhuma academia cadastrada.</p>
        )}

        {planos.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Planos Cadastrados</h3>
            <ul className="space-y-2">
              {planos.map((plano) => (
                <li key={plano.id} className="flex justify-between bg-white p-3 border rounded-lg shadow-sm">
                  <span><strong>{plano.nome}</strong> - {plano.valor} reais</span>
                  <button onClick={() => navigate(`/planos/editar/${plano.id}`)} className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800">
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {atividades.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Atividades Cadastradas</h3>
            <ul className="space-y-2">
              {atividades.map((atividade) => (
                <li key={atividade.id} className="flex justify-between bg-white p-3 border rounded-lg shadow-sm">
                  <span><strong>{atividade.nome}</strong> - {atividade.horario} ({atividade.diaSemana})</span>
                  <button onClick={() => navigate(`/atividades/editar/${atividade.id}`)} className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800">
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ModalDialog
        isOpen={isModalDeleteUserIsOpen}
        onClose={() => setIsModalDeleteUserIsOpen(false)}
        title="Deletar Usuário"
        onConfirm={handleDeleteUser}
        description="Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita."
        loading={handleLoading}
      />
    </div>
  );
};

export default PerfilAcademiaPage;
