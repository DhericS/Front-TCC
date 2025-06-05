import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormTreino from '../components/FormTreino';
import FormDieta from '../components/FormDieta';
import ModalDialog from '../components/ModalDialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import api from '../services/api';

const PerfilPersonalPage = ({ user }) => {
  const [imagemUrl, setImagemUrl] = useState(user.imagemUrl || '');
  const [uploading, setUploading] = useState(false);

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
        const res = await axios.get(`https://backend.guidesfit.com.br/treino?personalId=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (Array.isArray(res.data)) setTreinos(res.data);
        else setTreinos([]);
      } catch (error) {
        setTreinos([]);
      } finally {
        setLoadingTreinos(false);
      }
    };

    const fetchDieta = async () => {
      setLoadingDietas(true);
      try {
        const res = await axios.get(`https://backend.guidesfit.com.br/dieta?personalId=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (Array.isArray(res.data)) setDietas(res.data);
        else setDietas([]);
      } catch (error) {
        setDietas([]);
      } finally {
        setLoadingDietas(false);
      }
    };

    fetchTreino();
    fetchDieta();
  }, [user.id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoUsuario', 'personal');

    try {
      setUploading(true);
      const res = await api.post(`/usuarios/${user.id}/upload-imagem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImagemUrl(res.data.url);
      toast.success('Foto de perfil atualizada!');
    } catch (error) {
      toast.error('Erro ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir sua conta?');
    if (!confirm) return;

    try {
      await api.delete(`/usuarios/${user.id}`, {
        params: { userType: user.role },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário.');
    }
  };

  const handleEdit = () => navigate('/perfil/editar');

  const handleDeleteTreino = async (id) => {
    try {
      await axios.delete(`https://backend.guidesfit.com.br/treino/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTreinos(treinos.filter((treino) => treino.id !== id));
      setIsModalTreinoOpen(false);
    } catch {
      toast.error('Erro ao deletar treino.');
    }
  };

  const handleDeleteDieta = async (id) => {
    try {
      await axios.delete(`https://backend.guidesfit.com.br/dieta/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDietas(dietas.filter((dieta) => dieta.id !== id));
      setIsModalDietaOpen(false);
      toast.success('Dieta deletada com sucesso!');
    } catch {
      toast.error('Erro ao deletar dieta.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">

      {/* Foto de Perfil */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
          <img
            src={imagemUrl || '/assets/imagens/personal-default.jpg'}
            alt="Foto de Perfil"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="mb-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="upload-photo"
          disabled={uploading}
        />
        <label htmlFor="upload-photo" className="cursor-pointer text-blue-600 hover:underline">
          {uploading ? 'Enviando...' : 'Alterar foto de perfil'}
        </label>
      </div>

      <motion.div
        className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl p-10 border border-gray-200"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold text-black mb-2">👋 Olá, {user.nome}</h2>
            <p className="text-gray-500 text-lg">Perfil do Personal</p>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={handleEdit}
              className="px-5 py-2 rounded-lg border border-black bg-black text-white font-medium 
              hover:bg-white hover:text-black transition-all shadow-md"
            >
              ✏️ Editar
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 rounded-lg border border-black text-black font-medium 
              hover:bg-black hover:text-white transition-all shadow-md"
            >
              🗑️ Excluir
            </button>
          </div>
        </div>

        {/* Treinos */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-black mb-6">🏋️‍♂️ Treinos</h3>

          <button
            onClick={() => navigate('/treinos/cadastrar')}
            className="px-5 py-2 rounded-lg border border-black bg-black text-white font-medium 
            hover:bg-white hover:text-black transition-all shadow-md mb-4"
          >
            Cadastrar Treino
          </button>

          {loadingTreinos ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <span className="ml-3 text-gray-700">Carregando treinos...</span>
            </div>
          ) : treinos.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {treinos.map((treino) => (
                <motion.li
                  key={treino.id}
                  className="border border-gray-300 rounded-xl p-5 bg-gray-50 shadow hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold text-xl text-black mb-2">{treino.nome}</h4>
                  <p className="text-sm text-gray-600 mb-5">{treino.descricao}</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/treinos/${treino.id}/editar`)}
                      className="px-4 py-1.5 text-sm border border-black rounded-lg 
                      hover:bg-black hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(treino.id);
                        setIsModalTreinoOpen(true);
                      }}
                      className="px-4 py-1.5 text-sm text-red-600 border border-red-600 rounded-lg 
                      hover:bg-red-600 hover:text-white transition"
                    >
                      Deletar
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum treino cadastrado.</p>
          )}
        </div>

        {/* Dietas */}
        <div>
          <h3 className="text-2xl font-semibold text-black mb-6">🍎 Dietas</h3>

          <button
            onClick={() => navigate('/dietas/cadastrar')}
            className="px-5 py-2 rounded-lg border border-black bg-black text-white font-medium 
            hover:bg-white hover:text-black transition-all shadow-md mb-4"
          >
            Cadastrar Dieta
          </button>

          {loadingDietas ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <span className="ml-3 text-gray-700">Carregando dietas...</span>
            </div>
          ) : dietas.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dietas.map((dieta) => (
                <motion.li
                  key={dieta.id}
                  className="border border-gray-300 rounded-xl p-5 bg-gray-50 shadow hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold text-xl text-black mb-2">{dieta.nome}</h4>
                  <p className="text-sm text-gray-600 mb-5">{dieta.descricao}</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/dietas/${dieta.id}/editar`)}
                      className="px-4 py-1.5 text-sm border border-black rounded-lg 
                      hover:bg-black hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(dieta.id);
                        setIsModalDietaOpen(true);
                      }}
                      className="px-4 py-1.5 text-sm text-red-600 border border-red-600 rounded-lg 
                      hover:bg-red-600 hover:text-white transition"
                    >
                      Deletar
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma dieta cadastrada.</p>
          )}
        </div>
      </motion.div>

      {/* Modais para deletar */}
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
