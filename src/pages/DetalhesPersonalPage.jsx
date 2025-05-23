import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';
import Avaliacoes from '../components/Avaliacoes';
import { useGetUser } from '../hooks/useGetUser';

export default function DetalhesPersonalPage() {
  const { id } = useParams();
  const [personal, setPersonal] = useState(null);
  const { user, loading: loadingUser } = useGetUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/usuarios?tipoUsuario=personal`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        const encontrado = res.data.find(p => p.id.toString() === id);
        if (!encontrado) {
          alert('Personal não encontrado.');
        }
        setPersonal(encontrado || null);
      })
      .catch(() => setPersonal(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loadingUser || !user || personal === null || loading) {
    return <div className="text-center py-10">Carregando dados...</div>;
  }

  const telefoneFormatado = personal.telefone?.replace(/[^\d]/g, '');
  const mensagem = encodeURIComponent(`Olá ${personal.nome}, vi seu perfil no nosso app e gostaria de saber mais sobre seus treinos!`);
  const whatsappUrl = telefoneFormatado ? `https://wa.me/55${telefoneFormatado}?text=${mensagem}` : null;

  return (
    <section className="py-16 px-6 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto bg-gray-100 rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={personal.imagemUrl || '/assets/imagens/personal-default.jpg'}
            alt={personal.nome}
            className="w-full sm:w-1/3 h-auto rounded-lg object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-black mb-4">{personal.nome}</h1>
            <p className="text-gray-700 mb-2"><strong>CREF:</strong> {personal.cref || 'Não informado'}</p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> {personal.email}</p>
            <p className="text-gray-700 mb-2"><strong>Telefone:</strong> {personal.telefone || 'Não informado'}</p>
            <p className="text-yellow-500 font-semibold">
              ⭐ {personal.avaliacao?.toFixed(1) || '0.0'} ({personal.totalAvaliacoes || 0} avaliações)
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
              >
                Falar com Personal no WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="mt-10">
          <Avaliacoes
            entidadeId={personal.id}
            tipoEntidade="PERSONAL"
            usuarioLogadoId={user.id}
          />
        </div>
      </div>
    </section>
  );
}