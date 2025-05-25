import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Avaliacoes({ entidadeId, tipoEntidade, usuarioLogadoId }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [comentarioEdit, setComentarioEdit] = useState('');
  const [notaEdit, setNotaEdit] = useState(5);
  const [editandoId, setEditandoId] = useState(null);

  const [comentarioNovo, setComentarioNovo] = useState('');
  const [notaNova, setNotaNova] = useState(5);
  const [criando, setCriando] = useState(false);

  const fetchAvaliacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { tipoEntidade };
      if (entidadeId) params.entidadeId = entidadeId;

      const res = await api.get('/avaliacoes', {
        params,
      });
      setAvaliacoes(res.data);
    } catch (err) {
      setError('Erro ao carregar avaliações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entidadeId) {
      fetchAvaliacoes();
    }
  }, [entidadeId]);

  const criarAvaliacao = async () => {
    try {
      await api.post('/avaliacoes', {
        nota: notaNova,
        comentario: comentarioNovo,
        usuarioId: usuarioLogadoId,
        tipoEntidade,
        entidadeId,
      });
      setComentarioNovo('');
      setNotaNova(5);
      setCriando(false);
      fetchAvaliacoes();
    } catch {
      alert('Erro ao criar avaliação.');
    }
  };

  const iniciarEdicao = (avaliacao) => {
    setEditandoId(avaliacao.id);
    setComentarioEdit(avaliacao.comentario);
    setNotaEdit(avaliacao.nota);
    setModoEdicao(true);
  };

  const salvarEdicao = async () => {
    try {
      await api.put(`/avaliacoes/${editandoId}`, {
        nota: notaEdit,
        comentario: comentarioEdit,
        usuarioId: usuarioLogadoId,
        tipoEntidade,
        entidadeId,
      });
      setModoEdicao(false);
      setEditandoId(null);
      fetchAvaliacoes();
    } catch {
      alert('Erro ao atualizar avaliação.');
    }
  };

  const deletarAvaliacao = async (id) => {
    if (!window.confirm('Confirma deletar esta avaliação?')) return;
    try {
      await api.delete(`/avaliacoes/${id}`);
      fetchAvaliacoes();
    } catch {
      alert('Erro ao deletar avaliação.');
    }
  };

  if (loading) return <p>Carregando avaliações...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">Avaliações</h3>

      {avaliacoes.length === 0 && !criando && (
        <>
          <p className="mb-4 text-gray-600">Sem comentários.</p>
          <button
            onClick={() => setCriando(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Adicionar Comentário
          </button>
        </>
      )}

      {criando && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <label className="block mb-2 font-semibold">Nota (1 a 5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={notaNova}
            onChange={(e) => setNotaNova(Number(e.target.value))}
            className="border rounded px-2 py-1 mb-4 w-20"
          />
          <label className="block mb-2 font-semibold">Comentário</label>
          <textarea
            value={comentarioNovo}
            onChange={(e) => setComentarioNovo(e.target.value)}
            className="border rounded px-2 py-1 w-full mb-4"
            rows={3}
          />
          <div>
            <button
              onClick={criarAvaliacao}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
            >
              Salvar
            </button>
            <button
              onClick={() => setCriando(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {avaliacoes.map((avaliacao) => (
          <li key={avaliacao.id} className="border rounded p-4 bg-gray-100 shadow">
            {modoEdicao && editandoId === avaliacao.id ? (
              <>
                <label className="block mb-1 font-semibold">Nota (1 a 5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={notaEdit}
                  onChange={(e) => setNotaEdit(Number(e.target.value))}
                  className="border rounded px-2 py-1 mb-2 w-20"
                />
                <label className="block mb-1 font-semibold">Comentário</label>
                <textarea
                  value={comentarioEdit}
                  onChange={(e) => setComentarioEdit(e.target.value)}
                  className="border rounded px-2 py-1 w-full mb-2"
                  rows={3}
                />
                <div>
                  <button
                    onClick={salvarEdicao}
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setModoEdicao(false)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Nota: {avaliacao.nota}</span>
                  {avaliacao.usuarioId === usuarioLogadoId && (
                    <div className="space-x-2">
                      <button
                        onClick={() => iniciarEdicao(avaliacao)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deletarAvaliacao(avaliacao.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Deletar
                      </button>
                    </div>
                  )}
                </div>
                <p>{avaliacao.comentario || <em>Sem comentário</em>}</p>
              </>
            )}
          </li>
        ))}
      </ul>

      {avaliacoes.length > 0 && !criando && (
        <button
          onClick={() => setCriando(true)}
          className="mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Adicionar Comentário
        </button>
      )}
    </div>
  );
}
