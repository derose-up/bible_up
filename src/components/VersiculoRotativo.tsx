import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const versiculos = [
  {
    texto: '✨ "Ensina a criança no caminho em que deve andar..."',
    referencia: 'Provérbios 22:6'
  },
  {
    texto: '✨ "Lâmpada para os meus pés é a tua palavra..."',
    referencia: 'Salmo 119:105'
  },
  {
    texto: '✨ "Deixai vir a mim os pequeninos..."',
    referencia: 'Marcos 10:14'
  },
  {
    texto: '✨ "A fé vem pelo ouvir, e o ouvir pela palavra de Deus."',
    referencia: 'Romanos 10:17'
  },
  {
    texto: '✨ "Tudo posso naquele que me fortalece."',
    referencia: 'Filipenses 4:13'
  },
];

const VersiculoRotativo = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % versiculos.length);
    }, 10000); // 10 segundos

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="text-center mt-8 mb-12 px-4">
      <div className="inline-block max-w-xl px-6 py-4 bg-purple-100 dark:bg-purple-100 text-purple-900 dark:text-purple-900 rounded-xl shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg md:text-xl font-medium mb-1">
              {versiculos[index].texto}
            </p>
            <p className="text-sm md:text-base italic text-purple-900 dark:text-purple-900">
              {versiculos[index].referencia}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VersiculoRotativo;
