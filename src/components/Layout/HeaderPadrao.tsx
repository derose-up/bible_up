import React from "react";
import { LucideIcon } from "lucide-react";

interface HeaderPadraoProps {
  titulo: string;
  icone: LucideIcon;
  contador?: string | number;
  descricao?: string;
}

const HeaderPadrao: React.FC<HeaderPadraoProps> = ({ titulo, icone: Icon, contador, descricao }) => {
  return (
    <div className="bg-purple-600 py-6 px-4 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Icon className="text-white w-7 h-7" />
            <h1 className="text-3xl font-bold text-white">{titulo}</h1>
          </div>
          {descricao && <p className="text-white/80 text-sm">{descricao}</p>}
        </div>
        {contador !== undefined && (
          <span className="text-white text-lg font-semibold">{contador}</span>
        )}
      </div>
    </div>
  );
};

export default HeaderPadrao;
