import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormTreino from '../components/FormTreino';
import { toast } from 'sonner';
import ModalDialog from '../components/ModalDialog';
import FormDieta from '../components/FormDieta';

const PerfilPersonalPage = ({ user }) => {
  const [treinos, setTreinos] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [loadingTreinos, setLoadingTreinos] = useState(false);
  const [loadingDietas, setLoadingDietas] = useState(false);
  const [isModalTreinoOpen, setIsModalTreinoOpen] = useState(false);
  const [isModalDietaOpen, setIsModalDietaOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreino = async () => {
      setLoadingTreinos(true);
      try {
        const res = await axios.get(`http://localhost:8080/treino?personalId=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (Array.isArray(res.data)) setTreinos(res.data);
        else setTreinos([]);
      } catch (error) {
        setTreinos([]);
      } finally {
        setLoadingTreinos(false);
      }
    }

    const fetchDieta = async () => {
      setLoadingDietas(true);
      try {
        const res = await axios.get(`http://localhost:8080/dieta?personalId=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (Array.isArray(res.data)) setDietas(res.data);
        else setDietas([]);
      } catch (error) {
        setDietas([]);
      } finally {
        setLoadingDietas(false);
      }
    }

    fetchTreino();
    fetchDieta();
  }, [user.id]);

  const handleEdit = () => navigate('/perfil/editar');

  const handleDelete = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir sua conta?');
    if (!confirm) return;

    try {
      await axios.delete(`/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      alert('Erro ao excluir usuário.');
    }
  };

  const handleDeleteTreino = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/treino/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTreinos(treinos.filter((treino) => treino.id !== id));
      setIsModalTreinoOpen(false);
    } catch (error) {
      toast.error('Erro ao deletar treino.');
    }
  }

  const handleDeleteDieta = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/dieta/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDietas(prev => prev.filter((dieta) => dieta.id !== id));
      setIsModalDietaOpen(false);
      toast.success('Dieta deletada com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar Dieta.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Olá, {user.nome}</h2>
            <p className="text-gray-600">Perfil do Personal</p>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <button onClick={handleEdit} className="px-4 py-2 border border-black rounded-md bg-black text-white hover:bg-white hover:text-black transition">Editar</button>
            <button onClick={handleDelete} className="px-4 py-2 border border-black rounded-md text-black hover:bg-black hover:text-white transition">Excluir</button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-black mb-4">Treinos Criados</h3>

          {loadingTreinos ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <span className="ml-2 text-gray-700">Carregando treinos...</span>
            </div>
          ) : treinos.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treinos.map((treino) => (
                <li
                  key={treino.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-lg text-black">{treino.nome}</h4>
                  <p className="text-sm text-gray-600 mb-4">{treino.descricao}</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/treinos/${treino.id}/editar`)}
                      className="px-3 py-1 text-sm border border-black rounded hover:bg-black hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(treino.id);
                        setIsModalTreinoOpen(true);
                      }}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum treino cadastrado.</p>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-black mb-4">Dietas Criadas</h3>

          {loadingDietas ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <span className="ml-2 text-gray-700">Carregando dietas...</span>
            </div>
          ) : dietas.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietas.map((dieta) => (
                <li
                  key={dieta.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-lg text-black">{dieta.nome}</h4>
                  <p className="text-sm text-gray-600 mb-4">{dieta.descricao}</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/dietas/${dieta.id}/editar`)}
                      className="px-3 py-1 text-sm border border-black rounded hover:bg-black hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(dieta.id);
                        setIsModalDietaOpen(true);
                      }}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma dieta cadastrada.</p>
          )}
        </div>

      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
        <FormTreino userId={user.id} onSubmit={(data) => console.log()} />
        <FormDieta personalId={user.id} onSubmit={(data) => console.log()} />
      </div>

      <ModalDialog
        isOpen={isModalTreinoOpen}
        onClose={() => setIsModalTreinoOpen(false)}
        title="Deletar Treino"
        onConfirm={() => handleDeleteTreino(selectedItem)}
        description="Tem certeza que deseja deletar este treino? Esta ação não pode ser desfeita."
      />
      <ModalDialog
        isOpen={isModalDietaOpen}
        onClose={() => setIsModalDietaOpen(false)}
        title="Deletar Dieta"
        onConfirm={() => handleDeleteDieta(selectedItem)}
        description="Tem certeza que deseja deletar esta Dieta? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default PerfilPersonalPage;
