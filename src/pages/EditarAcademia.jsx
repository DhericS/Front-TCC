import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import ModalDialog from '../components/ModalDialog';
import { toast } from 'sonner';
import SkeletonParagraphs from '../components/skeletons/SkeletonParagraphs';

const diaLabel = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo'
};

const EditarAcademia = () => {
  const { id } = useParams();
  const [academia, setAcademia] = useState(null);
  const [isModalDeletePlanoOpen, setIsModalDeletePlanoOpen] = useState(false);
  const [isModalDeleteAtividadeOpen, setIsModalDeleteAtividadeOpen] = useState(false);
  const [isModalDeleteAcademiaIsOpen, setIsModalDeleteAcademiaIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcademia = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/academia/${id}`);
        setAcademia(res.data);
      } catch (error) {
        toast.error('Erro ao editar Academia');
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    fetchAcademia();
  }, [id, navigate]);

  const handleUploadImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await api.post(`/academia/${id}/upload-imagem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAcademia((prev) => ({ ...prev, imagemUrl: res.data.url }));
      toast.success('Imagem da academia atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePlano = async (planoId) => {
    try {
      setLoading(true);
      await api.delete(`/planos/${planoId}`);
      const res = await api.get(`/academia/${id}`);
      setAcademia(res.data);
      toast.success('Plano deletado com sucesso.');
    } catch {
      toast.error('Erro ao deletar plano.');
    } finally {
      setIsModalDeletePlanoOpen(false);
      setLoading(false);
    }
  };

  const handleDeleteAtividade = async (atividadeId) => {
    try {
      setLoading(true);
      await api.delete(`/atividades/${atividadeId}`);
      const res = await api.get(`/academia/${id}`);
      setAcademia(res.data);
      toast.success('Atividade deletada com sucesso.');
    } catch {
      toast.error('Erro ao deletar atividade.');
    } finally {
      setIsModalDeleteAtividadeOpen(false);
      setLoading(false);
    }
  };

  const handleDeleteAcademia = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/academia/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Academia deletada com sucesso.');
      navigate('/perfil-academia');
    } catch {
      toast.error('Erro ao deletar academia.');
    } finally {
      setIsModalDeleteAcademiaIsOpen(false);
      setLoading(false);
    }
  };

  if (!academia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonParagraphs />
      </div>
    );
  }

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div>
            <img
              src={academia.imagemUrl || '/assets/imagens/default-background.jpg'}
              alt={academia.nome}
              className="w-full h-72 object-cover rounded-2xl shadow-md mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImagem}
              className="hidden"
              id="upload-image"
              disabled={uploading}
            />
            <label
              htmlFor="upload-image"
              className={`inline-block cursor-pointer px-6 py-2 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Enviando...' : 'Alterar imagem da academia'}
            </label>
            <button
              onClick={() => {
                setSelectedItem(academia.id);
                setIsModalDeleteAcademiaIsOpen(true);
              }}
              className="mt-4 bg-red-600 text-white py-2 px-5 rounded-full hover:bg-red-700 transition"
            >
              Deletar Academia
            </button>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-3">{academia.nome}</h2>
              <p className="text-lg text-gray-600 mb-2">{academia.endereco}</p>
              <p className="text-md text-gray-700 mb-4">{academia.descricao}</p>
              <span className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full">
                {academia.tipoAcad}
              </span>
            </div>

            <div className="mt-6 flex gap-4 flex-wrap">
              <Link to={`/academias/${academia.id}/editar/dados`} className="bg-black text-white py-2 px-5 rounded-full hover:bg-gray-800 transition">
                Editar Dados da Academia
              </Link>
              <Link to={`/planos/cadastrar?academiaId=${academia.id}`} className="bg-black text-white py-2 px-5 rounded-full hover:bg-gray-800 transition">
                Cadastrar Plano
              </Link>
              <Link to={`/atividades/cadastrar?academiaId=${academia.id}`} className="bg-black text-white py-2 px-5 rounded-full hover:bg-gray-800 transition">
                Cadastrar Atividade
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Listagem de Planos */}
        {academia.planos && academia.planos.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">Planos Cadastrados</h3>
            <div className="space-y-3">
              {academia.planos.map((plano) => (
                <div key={plano.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm">
                  <span className="font-semibold">{plano.nome} - R$ {plano.preco}</span>
                  <div className="flex gap-2">
                    <Link to={`/planos/editar/${plano.id}`} className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 transition">Editar</Link>
                    <button onClick={() => { setSelectedItem(plano.id); setIsModalDeletePlanoOpen(true); }} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listagem de Atividades */}
        {academia.atividades && academia.atividades.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">Atividades Cadastradas</h3>
            <div className="space-y-3">
              {academia.atividades.map((atividade) => (
                <div key={atividade.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm">
                  <span className="font-semibold">{atividade.nome} - {diaLabel[atividade.diaSemana]} às {atividade.horario}</span>
                  <div className="flex gap-2">
                    <Link to={`/atividades/editar/${atividade.id}`} className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 transition">Editar</Link>
                    <button onClick={() => { setSelectedItem(atividade.id); setIsModalDeleteAtividadeOpen(true); }} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ModalDialog
          isOpen={isModalDeletePlanoOpen}
          onClose={() => setIsModalDeletePlanoOpen(false)}
          title="Deletar Plano"
          onConfirm={() => handleDeletePlano(selectedItem)}
          description="Tem certeza que deseja deletar o plano? Esta ação não pode ser desfeita."
          loading={loading}
        />
        <ModalDialog
          isOpen={isModalDeleteAtividadeOpen}
          onClose={() => setIsModalDeleteAtividadeOpen(false)}
          title="Deletar Atividade"
          onConfirm={() => handleDeleteAtividade(selectedItem)}
          description="Tem certeza que deseja deletar a atividade? Esta ação não pode ser desfeita."
          loading={loading}
        />
        <ModalDialog
          isOpen={isModalDeleteAcademiaIsOpen}
          onClose={() => setIsModalDeleteAcademiaIsOpen(false)}
          title="Deletar Academia"
          onConfirm={() => handleDeleteAcademia(selectedItem)}
          description="Tem certeza que deseja deletar esta academia? Esta ação não pode ser desfeita."
          loading={loading}
        />
      </div>
    </section>
  );
};

export default EditarAcademia;
