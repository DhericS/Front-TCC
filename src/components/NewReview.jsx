import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";

const NewReview = ({ tipoEntidade, entidadeId, user }) => {
    const [form, setForm] = useState({ nota: '', comentario: '' });
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetFormulario = () => {
        setForm({ nota: '', comentario: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.warning('Faça o login para continuar!');
            return;
        }

        setLoadingSubmit(true);
        try {
            await api.post('/avaliacoes', {
                ...form,
                usuarioId: user.id,
                tipoEntidade,
                entidadeId,
            });
            toast.success('Avaliação Salva com sucesso!');
        } catch (e) {
            toast.error('Erro ao salvar avaliação!');
            console.log(e)
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <div>
            <form className="mb-6 p-4 border rounded bg-white shadow" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Nota (1 a 5)</label>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        name="nota"
                        value={form.nota}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-20"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Comentário</label>
                    <textarea
                        name="comentario"
                        value={form.comentario}
                        onChange={handleChange}
                        rows={3}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Escreva seu comentário..."
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                        disabled={loadingSubmit}
                    >
                        Salvar
                    </button>
                    <button
                        type="button"
                        onClick={resetFormulario}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50"
                        disabled={loadingSubmit}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewReview;