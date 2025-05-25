import React, { use, useState } from 'react';
import ModalForm from './ModalForm';

const Rodape = () => {
  const [isModalTermIsOpen, setIsModalTermIsOpen] = useState(false);

  return (
    <>
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
            <button className="mt-2 text-blue-600 px-4 py-2 rounded" onClick={() => setIsModalTermIsOpen(true)}>
                Termos de Uso
            </button>
          </div>
        </div>
      </footer>
      <ModalForm 
        title="Termos de Uso"
        description="
          1. Sobre a Plataforma
            Nossa plataforma conecta profissionais de educação física (personais) e alunos, permitindo a divulgação de perfis, informações de contato e avaliações dos profissionais.

          2. Cadastro e Responsabilidades
          O usuário deve fornecer informações verdadeiras no cadastro.

          O personal trainer é responsável por manter atualizado seu perfil, incluindo dados como CREF, foto, telefone e e-mail.

          Alunos devem utilizar a plataforma de forma ética e respeitosa.

          3. Uso da Plataforma
          É proibido qualquer uso que viole a lei, a moral ou os bons costumes.

          É proibido divulgar informações falsas ou inapropriadas.

          A comunicação entre usuários (ex.: via WhatsApp) é de inteira responsabilidade das partes envolvidas.

          4. Privacidade dos Dados
          Armazenamos apenas os dados necessários para funcionamento da plataforma.

          Seus dados não são compartilhados com terceiros, exceto quando exigido por lei ou para funcionamento dos serviços (ex.: exibição de contatos públicos no perfil dos profissionais).

          5. Limitação de Responsabilidade
          Não garantimos a qualidade, pontualidade ou resultados dos serviços oferecidos pelos profissionais cadastrados.

          A plataforma serve apenas como meio de divulgação e conexão entre usuários.

          6. Avaliações e Comentários
          Avaliações devem ser feitas de forma honesta, sem ofensas, discriminação ou conteúdo inapropriado.

          A plataforma se reserva o direito de remover avaliações que violem este termo.

          7. Alterações no Termo
          Podemos atualizar este termo a qualquer momento. Recomendamos que o usuário revise periodicamente.
        "
        onClose={() => setIsModalTermIsOpen(false)}
        onConfirm={() => {}}
        loading={false}
        isOpen={isModalTermIsOpen}
      />
    </>
  );
};

export default Rodape;
