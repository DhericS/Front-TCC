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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
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
    <section className="bg-white py-16 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12"
        >
          <motion.div className="relative">
            <motion.img
              variants={item}
              src={academia.imagemUrl || '/assets/imagens/default-background.jpg'}
              alt={academia.nome}
              className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-xl"
            />
            <label className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full cursor-pointer text-sm font-medium shadow">
              {uploading ? 'Enviando...' : 'Alterar Imagem'}
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImagem}
                className="hidden"
              />
            </label>
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-4">
            <h2 className="text-4xl font-extrabold text-black">{academia.nome}</h2>
            <p className="text-gray-600">{academia.endereco}</p>
            <p className="text-gray-700">{academia.descricao}</p>
            <span className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full w-fit">
              {academia.tipoAcad}
            </span>
            <div className="flex flex-wrap gap-4 mt-4">
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
          </motion.div>
        </motion.div>



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
