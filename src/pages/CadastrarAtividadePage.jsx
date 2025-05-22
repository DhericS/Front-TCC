import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';

const diasSemana = [
  'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'
];

const horariosDisponiveis = [
  '08:00 - 09:00',
  '18:00 - 19:00',
  '20:00 - 21:00'
];

const CadastrarAtividadePage = () => {
  const [searchParams] = useSearchParams();
  const academiaId = searchParams.get('academiaId');
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [academia, setAcademia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (academiaId) {
      api.get(`/academia/${academiaId}`)
        .then(res => setAcademia(res.data))
        .catch(() => setAcademia(null))
        .finally(() => setLoading(false));
    }
  }, [academiaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim() || diasSelecionados.length === 0 || horariosSelecionados.length === 0) {
      alert('Preencha todos os campos e selecione pelo menos um dia e um horário.');
      return;
    }

    const atividades = [];
    diasSelecionados.forEach((dia) => {
      horariosSelecionados.forEach((horario) => {
        atividades.push({ nome, diaSemana: dia, horario, academiaId: Number(academiaId) });
      });
    });

    try {
      await Promise.all(atividades.map((atividade) => api.post('/atividades', atividade)));
      alert('Atividades cadastradas com sucesso.');
      navigate(`/academias/${academiaId}/editar`);
    } catch (error) {
      alert('Erro ao cadastrar atividades.');
    }
  };

  const toggleDia = (dia) => {
    setDiasSelecionados(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  };

  const toggleHorario = (horario) => {
    setHorariosSelecionados(prev => prev.includes(horario) ? prev.filter(h => h !== horario) : [...prev, horario]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando detalhes da academia...</p>
      </div>
    );
  }

  if (!academia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar academia.</p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Cadastrar nova atividade para {academia.nome}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Nome da atividade</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Dias da semana</label>
              <div className="grid grid-cols-2 gap-2">
                {diasSemana.map((dia) => (
                  <label key={dia} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={diasSelecionados.includes(dia)}
                      onChange={() => toggleDia(dia)}
                    />
                    {dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Horários</label>
              <div className="flex flex-col gap-2">
                {horariosDisponiveis.map((horario) => (
                  <label key={horario} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={horariosSelecionados.includes(horario)}
                      onChange={() => toggleHorario(horario)}
                    />
                    {horario}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
              Salvar Atividades
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default CadastrarAtividadePage;
