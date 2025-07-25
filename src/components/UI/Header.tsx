import React from "react";
import { BookOpen } from "lucide-react";

interface HeaderProps {
  titulo: string;
  contador?: string;
  icone?: JSX.Element;
}

const Header: React.FC<HeaderProps> = ({ titulo, contador, icone }) => (
  <div className="bg-purple-600 py-6 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          {icone || <BookOpen className="text-white w-7 h-7" />}
          <h1 className="text-3xl font-bold text-white">{titulo}</h1>
        </div>
        {contador && <p className="text-white/80 text-sm">{contador}</p>}
      </div>
    </div>
  </div>
);

export default Header;
