import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../components/Menu';
import Rodape from '../components/Rodape';
import CardFeature from '../components/CardFeature';
import { motion } from 'framer-motion';

const HomePage = () => {
  const features = [
    {
      title: 'Treinos Personalizados',
      desc: 'Treinos da comunidade para todos os objetivos.',
      img: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
      link: '/treinos'
    },
    {
      title: 'Personal Trainers',
      desc: 'Encontre especialistas qualificados na sua região.',
      img: 'https://images.pexels.com/photos/13896072/pexels-photo-13896072.jpeg',
      link: '/personais'
    },
    {
      title: 'Academias Avaliadas',
      desc: 'Consulte estruturas, limpeza e horários de pico.',
      img: 'https://images.pexels.com/photos/13197535/pexels-photo-13197535.jpeg',
      link: '/academias'
    }
  ];

  const benefits = [
    'Acesso a treinos gratuitos',
    'Avalie academias e profissionais',
    'Plataforma responsiva e moderna',
    'Cadastro gratuito para academias',
    'Segurança de dados e LGPD',
    'Facilidade na busca e agendamento'
  ];

  return (
    <>

      {/* HERO section */}
      <section className="bg-black text-white py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/imagens/fundo.jpg')] bg-cover bg-center opacity-20"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-0 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Transforme sua Rotina Fitness</h1>
          <p className="text-lg text-gray-300 mb-8">Encontre academias, acesse treinos, conecte-se com os melhores profissionais.</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/cadastro" className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition">Comece Agora</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Destaques rápidos */}
      <section className="bg-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Soluções que te colocam em movimento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <CardFeature {...feature} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sobre a plataforma */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Por que usar o GuidesFit?
          </motion.h2>
          <p className="text-lg text-gray-300 mb-10">
            Criamos uma plataforma onde academias, personais e alunos se conectam de forma inteligente. Tudo em um só lugar: com informações, avaliações e treinos acessíveis.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left text-sm text-gray-300">
            {benefits.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <span className="text-white font-bold">•</span> {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-white py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">Pronto para melhorar sua jornada fitness?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Crie sua conta gratuitamente e tenha acesso ao melhor da sua região.</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/cadastro" className="bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800 transition">Quero me cadastrar</Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;
