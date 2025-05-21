import React from 'react';
import { Link } from 'react-router-dom';

const CardFeature = ({ title, desc, img, link }) => {
  return (
    <Link
      to={link}
      className="group block bg-gray-100 rounded-xl shadow hover:shadow-xl transition overflow-hidden"
    >
      <img
        src={img}
        alt={title}
        className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </div>
    </Link>
  );
};

export default CardFeature;
