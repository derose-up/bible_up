📘 Bible Up - UI Components
Este arquivo contém os componentes visuais padrão para o projeto.

---

### ✅ 1. RibbonBadge (Selo diagonal, canto ou reto)
```tsx
import React from "react";
import { Check } from "lucide-react";

interface RibbonBadgeProps {
  text: string;
  type?: "diagonal" | "corner" | "straight";
  color?: string; // Tailwind base: "green", "pink", "purple"
  icon?: boolean;
}

const RibbonBadge: React.FC<RibbonBadgeProps> = ({
  text,
  type = "diagonal",
  color = "green",
  icon = false,
}) => {
  const baseColors = `bg-gradient-to-r from-${color}-500 to-${color}-700 text-white`;

  if (type === "diagonal") {
    return (
      <span
        className={`absolute top-0 right-0 ${baseColors} text-xs font-bold px-8 py-1 transform rotate-45 origin-top-right shadow-lg`}
      >
        <span className="flex items-center justify-center gap-1 transform -rotate-45 text-[11px]">
          {icon && <Check size={12} />}
          {text}
        </span>
      </span>
    );
  }

  if (type === "corner") {
    return (
      <span
        className={`absolute top-0 right-0 ${baseColors} text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md flex items-center gap-1`}
      >
        {icon && <Check size={14} />}
        {text}
      </span>
    );
  }

  if (type === "straight") {
    return (
      <span
        className={`absolute top-2 right-2 ${baseColors} text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1`}
      >
        {icon && <Check size={14} />}
        {text}
      </span>
    );
  }

  return null;
};

export default RibbonBadge;


✅ 2. FavoriteButton

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";

interface FavoriteButtonProps {
  itemId: string;
  type: "licoes" | "atividades";
  isPremium?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ itemId, type }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem(`favoritos_${type}`) || "[]");
    setIsFavorited(favoritos.includes(itemId));
  }, [itemId, type]);

  const toggleFavorite = () => {
    const key = `favoritos_${type}`;
    const favoritos = JSON.parse(localStorage.getItem(key) || "[]");

    if (isFavorited) {
      const updated = favoritos.filter((id: string) => id !== itemId);
      localStorage.setItem(key, JSON.stringify(updated));
      setIsFavorited(false);
      toast("Removido dos favoritos");
    } else {
      favoritos.push(itemId);
      localStorage.setItem(key, JSON.stringify(favoritos));
      setIsFavorited(true);
      toast.success("Adicionado aos favoritos");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
      aria-pressed={isFavorited}
    >
      <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
      <span className="text-sm">{isFavorited ? "Favorito" : "Favoritar"}</span>
    </button>
  );
};

export default FavoriteButton;


✅ 3. Header padrão (Tarja superior com título + contador)

import { BookOpen } from "lucide-react";

interface HeaderProps {
  titulo: string;
  contador?: string;
  icone?: JSX.Element;
}

const Header = ({ titulo, contador, icone }: HeaderProps) => (
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


✅ 4. Botão Scroll to Top

import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const ScrollTop = ({ visible }: { visible: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 0.4 }}
    className="fixed bottom-6 right-6 z-50"
  >
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  </motion.div>
);

export default ScrollTop;