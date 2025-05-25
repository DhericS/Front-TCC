import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-9xl font-extrabold text-black tracking-widest">
        404
      </h1>
      <div className="bg-gray-500 px-2 text-sm rounded rotate-12 absolute text-white">
        Página não encontrada
      </div>
      <p className="mt-6 text-lg text-neutral-700 text-center">
        Desculpe, a página que você está procurando não existe.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition"
      >
        Voltar para a Home
      </Link>
    </div>
  );
};

export default NotFound;
