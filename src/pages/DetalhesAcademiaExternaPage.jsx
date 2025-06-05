import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Menu from "../components/Menu";
import Rodape from "../components/Rodape";

const DetalhesAcademiaExternaPage = () => {
  const { placeId } = useParams();
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    api.get(`/academia/externas-detalhes?placeId=${placeId}`)
      .then(res => setDetalhes(res.data))
      .catch(() => setDetalhes(null));
  }, [placeId]);

  if (!detalhes) return <div className="text-center py-10">Carregando detalhes...</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">{detalhes.nome}</h1>
        <p className="mb-2"><strong>Endereço:</strong> {detalhes.endereco}</p>
        <p className="mb-2"><strong>Telefone:</strong> {detalhes.telefone || "Não informado"}</p>
        <p className="mb-2"><strong>Site:</strong> {detalhes.site || "Não informado"}</p>
        <p className="mb-2"><strong>Avaliação:</strong> ⭐ {detalhes.avaliacao} ({detalhes.totalAvaliacoes})</p>
        <p className="mb-2"><strong>Aberta Agora:</strong> {detalhes.abertaAgora ? "Sim" : "Não"}</p>
        <p className="mb-4 text-red-600 font-semibold italic border-l-4 border-red-500 pl-4">⚠️ As informações e imagens apresentadas são fornecidas por terceiros. A GuidesFit não se responsabiliza pela veracidade ou atualidade do conteúdo exibido.</p>
        <p className="mb-4">
          <strong>Horários:</strong>{" "}
          {Array.isArray(detalhes.horarios) ? detalhes.horarios.join(", ") : "Não informado"}
        </p>
        <a href={detalhes.mapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver no Google Maps</a>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {Array.isArray(detalhes.fotos) && detalhes.fotos.length > 0 ? (
            detalhes.fotos.map((foto, i) => (
              <img key={i} src={foto} alt="Foto da academia" className="rounded-lg shadow" />
            ))
          ) : (
            <p className="col-span-2 text-gray-500">Sem fotos disponíveis.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DetalhesAcademiaExternaPage;
