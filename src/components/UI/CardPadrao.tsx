import React from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import RibbonBadge from "./RibbonBadge";
import FavoriteButton from "./FavoriteButton";

interface CardPadraoProps {
  id: string;
  titulo: string;
  resumo: string;
  imagem: string;
  isPremium?: boolean;
  isNovo?: boolean;
  isVisto?: boolean;
  tipo: "licoes" | "atividades";
  onClick?: () => void;
}

const CardPadrao: React.FC<CardPadraoProps> = ({
  id,
  titulo,
  resumo,
  imagem,
  isPremium = false,
  isNovo = false,
  isVisto = false,
  tipo,
  onClick,
}) => {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      onClick={onClick}
      className="relative rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition"
    >
      {/* Imagem */}
      <div className="relative w-full h-48">
        <img src={imagem} alt={titulo} className="w-full h-full object-cover" />
        {/* Badges */}
        {isNovo && <RibbonBadge text="Novo" color="green" type="diagonal" icon />}
        {isVisto && <RibbonBadge text="Visto" color="pink" type="corner" icon />}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-1 line-clamp-2">
          {titulo}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {resumo}
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Premium */}
          {isPremium && (
            <span className="flex items-center gap-1 text-yellow-500 text-xs font-semibold">
              <Crown className="w-4 h-4" /> Premium
            </span>
          )}
          {/* Botão Favoritar */}
          <FavoriteButton itemId={id} type={tipo} isPremium={isPremium} />
        </div>
      </div>
    </motion.article>
  );
};

export default CardPadrao;
