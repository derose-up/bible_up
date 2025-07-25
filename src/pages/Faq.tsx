import React from 'react';

const perguntas = [
  {
    pergunta: 'Posso cancelar a assinatura a qualquer momento?',
    resposta: 'Sim! Você pode cancelar sua assinatura sem complicações e continuar usando o premium até o final do período pago.'
  },
  {
    pergunta: 'Como funciona o plano anual?',
    resposta: 'O plano anual oferece um desconto de 33% comparado ao mensal.'
  },
  {
    pergunta: 'Os materiais ficam disponíveis offline?',
    resposta: 'Atualmente, os downloads de PDFs permitem acesso offline.'
  }
];

const Faq = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">Perguntas Frequentes (FAQ)</h1>
        
        {perguntas.map(({ pergunta, resposta }, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">{pergunta}</h3>
            <p className="text-gray-800 dark:text-gray-200">{resposta}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
