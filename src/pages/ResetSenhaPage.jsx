import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../services/api';

export default function RedefinirSenhaPage() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tokenValido, setTokenValido] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', {
        token,
        novaSenha,
      });

      toast.success(response.data || 'Senha redefinida com sucesso!');
      navigate('/login');
    } catch (err) {
      toast.error('Erro ao redefinir senha. Verifique o link ou tente novamente.');
      setTokenValido(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
    }
  }, [token]);

  return (
    <div className="flex min-h-screen">
      {/* Imagem lateral */}
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
            Redefina sua senha <br /> com segurança
          </motion.h1>
        </div>
      </motion.div>

      {/* Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <motion.form
          onSubmit={handleSubmit}
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
            <h2 className="text-2xl font-bold text-black mt-4">Nova Senha</h2>
          </div>

          {!tokenValido ? (
            <p className="text-red-600 text-center">
              Link inválido ou expirado. Solicite um novo link de recuperação.
            </p>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md font-semibold transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </motion.button>
            </>
          )}
        </motion.form>
      </div>
    </div>
  );
}
