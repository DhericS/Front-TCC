import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import SkeletonParagraphs from "./skeletons/SkeletonParagraphs";
import api from "../services/api";

const Reviews = ({ tipoEntidade, entidadeId }) => {
    const [loading, setLoading] = useState(true);
    const [avaliacoes, setAvaliacoes] = useState([]);
    
    useEffect(() => {
      const fetchAvaliacoes = async () => {
        
        setLoading(true);
        try {
            const res = await api.get('/avaliacoes', {
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

    const renderStars = (nota) => {
        return Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            size={20}
            className={i < nota ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
        ));
    };

    if (loading) {
        return <SkeletonParagraphs />;
    }

    return (
        <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6">Avaliações</h3>

            {avaliacoes.length === 0 ? (
                <p className="text-gray-500">Ainda não há avaliações para essa entidade.</p>
            ) : (
                <div className="space-y-6">
                {avaliacoes.map((avaliacao) => (
                    <div
                    key={avaliacao.id}
                    className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                    <div className="flex items-center mb-3">
                        {renderStars(avaliacao.nota)}
                        <span className="ml-3 text-sm text-gray-500">Nota: {avaliacao.nota}</span>
                    </div>
                    <p className="text-gray-700">
                        {avaliacao.comentario ? (
                        <>{avaliacao.comentario}</>
                        ) : (
                        <em className="text-gray-400">Sem comentário.</em>
                        )}
                    </p>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}

export default Reviews;