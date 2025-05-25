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
        console.error('Erro ao buscar academia:', error);
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
      // Atualiza URL da imagem da academia no estado
      setAcademia((prev) => ({
        ...prev,
        imagemUrl: res.data.url
      }));
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
          {/* Imagem e upload */}
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
              className={`inline-block cursor-pointer px-6 py-2 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Enviando...' : 'Alterar imagem da academia'}
            </label>
          </div>

          {/* Detalhes da academia */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-3">{academia.nome}</h2>
              <p className="text-lg text-gray-600 mb-2">{academia.endereco}</p>
              <p className="text-md text-gray-700 mb-4">{academia.descricao}</p>
              <span className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full">
                {academia.tipo}
              </span>
            </div>

            <div className="mt-6 flex gap-4 flex-wrap">
              <Link
                to={`/planos/cadastrar?academiaId=${academia.id}`}
                className="bg-black text-white py-2 px-5 rounded-full hover:bg-gray-800 transition"
              >
                Cadastrar Plano
              </Link>
              <Link
                to={`/atividades/cadastrar?academiaId=${academia.id}`}
                className="bg-black text-white py-2 px-5 rounded-full hover:bg-gray-800 transition"
              >
                Cadastrar Atividade
              </Link>
            </div>
          </div>
        </motion.div>

        {academia.atividades?.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Atividades</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {academia.atividades.map((a) => (
                <div key={a.id} className="bg-gray-50 p-4 rounded-xl shadow flex flex-col">
                  <div>
                    <h4 className="text-lg font-bold">{a.nome}</h4>
                    <p className="text-gray-500">{diaLabel[a.diaSemana]} - {a.horario}</p>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <Link
                      to={`/atividades/editar/${a.id}`}
                      className="border border-black text-black px-4 py-1 rounded-full hover:bg-black hover:text-white text-sm"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedItem(a.id);
                        setIsModalDeleteAtividadeOpen(true);
                      }}
                      className="border border-black text-black px-4 py-1 rounded-full hover:bg-black hover:text-white text-sm"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {academia.planos?.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-semibold mb-4">Planos Disponíveis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {academia.planos.map((p) => (
                <div key={p.id} className="bg-white border rounded-xl shadow p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold mb-1">{p.nome}</h4>
                    <p className="text-gray-600 mb-2">{p.descricao}</p>
                    <p className="text-3xl font-bold">
                      R$ {typeof p.preco === 'number' ? p.preco.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <Link
                      to={`/planos/editar/${p.id}`}
                      className="border border-black text-black px-4 py-1 rounded-full hover:bg-black hover:text-white text-sm"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedItem(p.id);
                        setIsModalDeletePlanoOpen(true);
                      }}
                      className="border border-black text-black px-4 py-1 rounded-full hover:bg-black hover:text-white text-sm"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
    </section>
  );
};

export default EditarAcademia;
