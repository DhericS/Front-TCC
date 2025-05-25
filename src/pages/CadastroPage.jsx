import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalForm from '../components/ModalForm';
import { toast } from 'sonner';

export default function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: '',
    cref: '',
    cnpj: '',
  });
  const [isModalTermIsOpen, setIsModalTermIsOpen] = useState(false);
  const [termAccepted, setTermAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cnpj') {
      value = value.replace(/\D/g, '')
                   .replace(/(\d{2})(\d)/, '$1.$2')
                   .replace(/(\d{3})(\d)/, '$1.$2')
                   .replace(/(\d{3})(\d{1,2})/, '$1/$2')
                   .replace(/(\d{4})(\d{1,2})/, '$1-$2')
                   .replace(/(-\d{2})\d+?$/, '$1');
    }

    if (name === 'cref') {
      value = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();

      const numberPart = value.substring(0, 5);
      const letterPart = value.substring(5, 6);
      const statePart = value.substring(6, 8);

      if (value.length <= 5) {
        value = numberPart;
      } else if (value.length <= 6) {
        value = `${numberPart}-${letterPart}`;
      } else {
        value = `${numberPart}-${letterPart}/${statePart}`;
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (!form.telefone.match(/^\d{10,11}$/)) {
      toast.error('Telefone inválido. Use somente números com DDD.');
      return;
    }

    if (form.senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (form.tipoUsuario === 'useracadadmin' && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(form.cnpj)) {
      toast.error('CNPJ inválido. Use o formato 00.000.000/0000-00');
      return;
    }

    if (form.tipoUsuario === 'personal' && !/^[0-9]{5,6}-[A-Z]{1,3}\/[A-Z]{2}$/.test(form.cref)) {
      toast.error('CREF inválido. Use o formato 123456-G/SP');
      return;
    }

    if (!termAccepted) {
      toast.error('Aceite os termos para continuar!');
      return;
    }

    const payload = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      senha: form.senha,
      tipoUsuario: form.tipoUsuario,
      role: form.tipoUsuario.toUpperCase(),
    };

    if (form.tipoUsuario === 'personal') payload.cref = form.cref;
    if (form.tipoUsuario === 'useracadadmin') payload.cnpj = form.cnpj;

    setLoading(true);
    try {
      await axios.post('/auth/register', payload);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      toast.error('Erro ao cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/imagens/fundo.jpg')" }}
      >
        <div className="bg-black bg-opacity-70 text-white w-full max-w-6xl rounded-2xl shadow-xl p-6 flex flex-col md:flex-row">
          <div className="md:w-1/2 flex flex-col justify-center p-6 text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">Seja Bem-Vindo!</h1>
            <p className="text-lg max-w-sm mx-auto text-gray-300">
              Cadastre-se para ter acesso a todas funcionalidades da plataforma GuidesFit.
            </p>
          </div>

          <div className="md:w-1/2 bg-white text-black rounded-xl p-6">
            <h2 className="text-2xl font-bold text-center text-black mb-6">Cadastro</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block font-semibold">Nome</label>
                <input type="text" name="nome" value={form.nome} onChange={handleChange} required className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" />
              </div>

              <div>
                <label className="block font-semibold">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" />
              </div>

              <div>
                <label className="block font-semibold">Telefone</label>
                <input type="tel" name="telefone" value={form.telefone} onChange={handleChange} required className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" placeholder="11999999999" maxLength={11} pattern="\d{11}" />
              </div>

              <div>
                <label className="block font-semibold">Senha</label>
                <input type="password" name="senha" value={form.senha} onChange={handleChange} required className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" />
              </div>

              <div>
                <label className="block font-semibold">Confirmar Senha</label>
                <input type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} required className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold">Tipo de Usuário</label>
                <select name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange} required className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition">
                  <option value="">Selecione</option>
                  <option value="useracad">Aluno</option>
                  <option value="personal">Personal</option>
                  <option value="useracadadmin">Estabelecimento</option>
                </select>
              </div>

              {form.tipoUsuario === 'personal' && (
                <div className="col-span-2">
                  <label className="block font-semibold">CREF</label>
                  <input type="text" name="cref" value={form.cref} onChange={handleChange} className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" required maxLength={15} pattern="^[A-Za-z0-9\-\/]+$" placeholder="12345-G/SP" />
                </div>
              )}

              {form.tipoUsuario === 'useracadadmin' && (
                <div className="col-span-2">
                  <label className="block font-semibold">CNPJ</label>
                  <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} className="w-full border border-gray-300 bg-white text-black rounded-md p-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" required />
                </div>
              )}

              <div className="col-span-2">
                <button
                  type='button'
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 
                  hover:bg-gray-100 hover:text-black transition-colors"
                  onClick={() => setIsModalTermIsOpen(true)}
                >
                  Termos de Uso e Privacidade
                </button>
              </div>

              <div className="col-span-2">
                <button type="submit" 
                  className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold border border-black hover:bg-white hover:text-black transition duration-300 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Cadastrar'}
                </button>
              </div>
              <div className="col-span-2">
                <button type="submit" 
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-md font-semibold border border-black hover:bg-white hover:text-black transition duration-300 disabled:opacity-50"
                  disabled={loading} 
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
        onConfirm={() => {
          setIsModalTermIsOpen(false);
          setTermAccepted(true);
        }}
        loading={false}
        isOpen={isModalTermIsOpen}
      />
    </>
  );
}