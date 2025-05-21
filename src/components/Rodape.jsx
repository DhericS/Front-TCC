import React from 'react';

const Rodape = () => {
  return (
    <footer className="bg-gray-100 p-6 mt-10 shadow-inner">
      <div className="flex justify-center mb-4">
        <img
          src="/assets/imagens/logo2.png"
          alt="GuidesFit Logo"
          className="h-20"
        />
      </div>

      <div className="text-center mb-4">
        <h5 className="font-semibold">Acompanhe o GuidesFit Nas Redes</h5>
        <div className="flex justify-center space-x-4 mt-2">
          <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
          <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
          <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        <div className="mb-2">
          <p>Desenvolvido por:</p>
          <ul>
            <li>Dheric Tadeu da Silva</li>
            <li>Davi da Silva</li>
            <li>Guilherme Pereira Matos</li>
          </ul>
        </div>
        <div className="mt-2">
          <p>
            Contato:{' '}
            <a
              href="mailto:guidesfitSAC@gmail.com"
              className="text-blue-600 underline"
            >
              guidesfitSAC@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;
