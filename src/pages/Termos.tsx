import React from 'react';

const Termos = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">Termos de Uso</h1>

        <p className="mb-4 text-gray-800 dark:text-gray-200">
          Ao acessar e utilizar o aplicativo <strong>BibleUp</strong>, você concorda com os seguintes termos e condições.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">1. Uso do Aplicativo</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          O conteúdo oferecido no BibleUp é destinado a professores, líderes e educadores cristãos para fins de ensino bíblico e crescimento espiritual.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">2. Conta e Assinatura</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          O usuário pode criar uma conta gratuita ou adquirir uma assinatura premium para acesso a conteúdos exclusivos. O cancelamento da assinatura pode ser feito a qualquer momento.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">3. Propriedade Intelectual</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          Todo o conteúdo disponível é protegido por direitos autorais. É proibida a reprodução ou distribuição sem autorização prévia.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">4. Responsabilidades</h2>
        <p className="mb-4 text-gray-800 dark:text-gray-200">
          O BibleUp se compromete a fornecer um serviço estável, mas não se responsabiliza por falhas temporárias ou indisponibilidade do sistema.
        </p>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

export default Termos;
