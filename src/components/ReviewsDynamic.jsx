import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Pencil, Trash2, X, Check } from "lucide-react";
import api from "../services/api";
import SkeletonParagraphs from "./skeletons/SkeletonParagraphs";
import ModalDialog from "./ModalDialog";

const ReviewsDynamic = ({ entidadeId, tipoEntidade, user }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [modalDeleteAvaliacaoIsOpen, setModalDelteAvaliacaoIsOpen] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);

  const [editandoId, setEditandoId] = useState(null);
  const [notaEdit, setNotaEdit] = useState(null);
  const [comentarioEdit, setComentarioEdit] = useState("");

  useEffect(() => {
      const fetchAvaliacoes = async () => {
        
        setLoading(true);
        try {
            const res = await api.get(`/avaliacoes`, {
                params: { tipoEntidade, entidadeId }
            });
            setAvaliacoes(res.data);
        } catch (err) {
            toast.error('Erro ao carregar avaliações.');
        } finally {
            setLoading(false);
        }
      };

    fetchAvaliacoes();
  }, [entidadeId]);

  const renderStars = (nota) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < nota ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));

  const iniciarEdicao = (avaliacao) => {
    setEditandoId(avaliacao.id);
    setNotaEdit(avaliacao.nota);
    setComentarioEdit(avaliacao.comentario);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNotaEdit(null);
    setComentarioEdit(null);
  };

  const salvarEdicao = async (avaliacao) => {
    setLoadingSubmit(true);
    try {
        await api.put(`/avaliacoes/${editandoId}`, {
            ...avaliacao,
            nota: notaEdit,
            comentario: comentarioEdit,
        });
        toast.success("Avaliação atualizada!");
        setAvaliacoes((prev) =>
            prev.map((a) =>
                a.id === editandoId
                ? { ...a, nota: notaEdit, comentario: comentarioEdit }
                : a
            )
        );
        cancelarEdicao();
    } catch {
      toast.error("Erro ao salvar.");
    } finally {
        setLoadingSubmit(false);
    }
  };

  const deletarAvaliacao = async () => {
    if (!selectedAvaliacao) {
      toast.error('Erro ao Deletar');
      return;
    }

    setLoadingSubmit(true);
    try {
      await api.delete(`/avaliacoes/${selectedAvaliacao.id}`);
      toast.success("Avaliação deletada.");
    } catch {
      toast.error("Erro ao deletar.");
    } finally {
      setAvaliacoes((prev) => prev.filter((a) => a.id !== selectedAvaliacao.id));
      setModalDelteAvaliacaoIsOpen(false);
      setLoadingSubmit(false);
      setSelectedAvaliacao(null);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center mt-10">
            <SkeletonParagraphs />
        </div>
    );
  }

  return (
    <>
        <div className="w-full mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Avaliações</h1>

            {avaliacoes.length === 0 ? (
                <p className="text-gray-500">Ainda não há avaliações.</p>
            ) : (
                <div className="space-y-6">
                {avaliacoes.map((avaliacao) => (
                    <div
                    key={avaliacao.id}
                    className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                    {editandoId === avaliacao.id ? (
                        <>
                        <div className="flex items-center gap-4 mb-3">
                            <label className="font-medium">Nota:</label>
                            <input
                            type="number"
                            min={1}
                            max={5}
                            value={notaEdit}
                            onChange={(e) => setNotaEdit(Number(e.target.value))}
                            className="border rounded px-2 py-1 w-16"
                            />
                        </div>
                        <textarea
                            rows={3}
                            value={comentarioEdit}
                            onChange={(e) => setComentarioEdit(e.target.value)}
                            className="border rounded w-full px-3 py-2 mb-4"
                            placeholder="Comentário"
                        />
                        <div className="flex gap-2">
                            <button
                            onClick={() => salvarEdicao(avaliacao)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            disabled={loadingSubmit}
                            >
                            <Check size={18} /> Salvar
                            </button>
                            <button
                            onClick={cancelarEdicao}
                            className="flex items-center gap-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                                disabled={loadingSubmit}
                            >
                            <X size={18} /> Cancelar
                            </button>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                            {renderStars(avaliacao.nota)}
                            <span className="text-sm text-gray-500">Nota {avaliacao.nota}</span>
                            </div>
                            {avaliacao?.usuarioId == user?.id && (
                                <div className="flex gap-2">
                                    <button
                                    onClick={() => iniciarEdicao(avaliacao)}
                                    className="text-blue-600 hover:text-blue-800"
                                    >
                                    <Pencil size={18} />
                                    </button>
                                    <button
                                    onClick={() => {
                                        setSelectedAvaliacao(avaliacao);
                                        setModalDelteAvaliacaoIsOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                    >
                                    <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-700">
                            {avaliacao.comentario || (
                            <em className="text-gray-400">Sem comentário.</em>
                            )}
                        </p>
                        </>
                    )}
                    </div>
                ))}
                </div>
            )}
        </div>

        <ModalDialog
            isOpen={modalDeleteAvaliacaoIsOpen}
            onClose={() => setModalDelteAvaliacaoIsOpen(false)}
            title="Deletar Avaliacao"
            onConfirm={deletarAvaliacao}
            description="Tem certeza que deseja deletar a Avaliação? Esta ação não pode ser desfeita."
            loading={loadingSubmit}
        />
    </>
  );
};

export default ReviewsDynamic;
