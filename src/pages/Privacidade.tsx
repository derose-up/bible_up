import React from 'react';

const Privacidade = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">Política de Privacidade</h1>

        <p className="mb-4 text-gray-800 dark:text-gray-200">
          A privacidade dos nossos usuários é prioridade. Esta política descreve como coletamos, usamos e protegemos seus dados.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">1. Dados Coletados</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          Coletamos dados como nome, e-mail, igreja, função e informações de uso, para melhorar a experiência e oferecer conteúdos personalizados.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">2. Uso dos Dados</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          Os dados são usados exclusivamente para fins internos: personalização de conteúdo, contato com o usuário e envio de atualizações.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">3. Compartilhamento</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          Não vendemos nem compartilhamos seus dados com terceiros, exceto quando exigido por lei.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">4. Segurança</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          Utilizamos tecnologias seguras para proteger suas informações, incluindo criptografia e autenticação.
        </p>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

export default Privacidade;
