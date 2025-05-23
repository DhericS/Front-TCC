import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function EsquecerSenhaPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setEnviado(true);
      toast.success('E-mail de recuperação enviado!');
    } catch {
      toast.error('Erro ao enviar e-mail. Verifique se o e-mail está correto.');
    }
  };

  return (
    <div className="flex min-h-screen">
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
            Esqueceu sua senha?<br />Recupere o acesso agora mesmo!
          </motion.h1>
        </div>
      </motion.div>

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
            <h2 className="text-2xl font-bold text-black mt-4">
              Recuperar Acesso
            </h2>
          </div>

          {enviado ? (
            <p className="text-green-600 text-center">Verifique seu e-mail para redefinir sua senha.</p>
          ) : (
            <>
              <label className="block mb-2 text-sm font-medium">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="exemplo@email.com"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded"
              >
                Enviar link de recuperação
              </button>
            </>
          )}
        </motion.form>
      </div>
    </div>
  );
}
