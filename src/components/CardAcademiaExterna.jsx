import React from "react";
import { Link } from "react-router-dom";

const CardAcademiaExterna = ({ academia }) => {
  return (
    <Link to={"/academias-externas/" + academia.placeId}>
      <div className="bg-white rounded-xl p-4 shadow hover:scale-105 transition duration-300">
        <h3 className="text-lg font-semibold text-black">{academia.nome}</h3>
        <p className="text-gray-700">{academia.endereco}</p>
        <p className="text-yellow-500">⭐ {academia.avaliacao} ({academia.totalAvaliacoes})</p>
        <p className="text-sm text-gray-400">{academia.status}</p>
      </div>
    </Link>
  );
};

export default CardAcademiaExterna;
