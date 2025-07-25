import React from 'react';

const Sobre = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">Sobre o BibleUp</h1>

        <p className="mb-4 text-gray-800 dark:text-gray-200">
          O <strong>BibleUp</strong> é um aplicativo criado para ajudar professores e líderes a ensinar a Bíblia com propósito, fé e tecnologia.
        </p>

        <p className="mb-4 text-gray-800 dark:text-gray-200">
          Nossa missão é oferecer materiais de alta qualidade para todas as faixas etárias, facilitando o aprendizado bíblico de forma interativa e acessível.
        </p>

        <p className="mb-4 text-gray-800 dark:text-gray-200">
          <strong>Equipe:</strong> Somos um grupo de educadores, desenvolvedores e líderes comprometidos em transformar o ensino bíblico.
        </p>
      </div>
    </div>
  );
};

export default Sobre;
