import React from "react";

interface FiltroPadraoProps {
  opcoes: string[];
  ativo: string;
  onChange: (filtro: string) => void;
}

const FiltroPadrao: React.FC<FiltroPadraoProps> = ({ opcoes, ativo, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 my-6 justify-center">
      {opcoes.map((opcao) => (
        <button
          key={opcao}
          onClick={() => onChange(opcao)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            ativo === opcao
              ? "bg-purple-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900"
          }`}
        >
          {opcao}
        </button>
      ))}
    </div>
  );
};

export default FiltroPadrao;
