import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, senha });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/home');
    } catch (err) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo com imagem e overlay */}
      <motion.div
        className="hidden lg:flex w-1/2 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/assets/imagens/fundo.jpg"
          alt="Fitness"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-4xl font-extrabold px-6 text-center"
          >
            Seu Guia Completo <br /> para uma Vida Fitness!
          </motion.h1>
        </div>
      </motion.div>

      {/* Formulário de login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <motion.form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md mx-4"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 text-center">
            <img
              src="/assets/imagens/logo2.png"
              alt="GuidesFit Logo"
              className="mx-auto h-16"
            />
            <h2 className="text-2xl font-bold text-black mt-4">
              Entrar na sua conta
            </h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold transition-all duration-200"
          >
            Entrar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-md font-semibold transition-all duration-200 mt-2"
            onClick={() => navigate('/cadastro')}
          >
            Registrar
          </motion.button>

          <div className="text-sm text-center mt-4 text-gray-500">
            <a href="/esquecer-senha" className="hover:underline text-black">
              Esqueceu sua senha?
            </a>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginPage;
