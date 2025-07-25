import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Lock } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import RibbonBadge from "../UI/RibbonBadge";
import FavoriteButton from "../UI/FavoriteButton";
import { Licao, CATEGORIA_CORES, Usuario } from "../../types";
import { formatarData, isNovo } from "../../utils/date";
import toast from "react-hot-toast";

// ✅ Badge para categorias
const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span
    style={{ backgroundColor: `${color}20`, color }}
    className="inline-block px-2 py-1 rounded-full text-xs font-semibold select-none"
  >
    {children}
  </span>
);

interface LessonCardProps {
  licao: Licao;
  jaVisto: boolean;
  userData: Usuario | null;
  onClick: (licao: Licao) => void;
}

// ✅ Função para exibir resumo da história
const renderIntro = (texto: string) => {
  if (!texto) return null;
  const linhas = texto.split("\n").filter(Boolean).slice(1, 3);
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
      {linhas.map((linha, i) => (
        <span
          key={i}
          dangerouslySetInnerHTML={{
            __html: linha.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
          }}
        />
      ))}
    </p>
  );
};

const LessonCardComponent: React.FC<LessonCardProps> = ({ licao, jaVisto, userData, onClick }) => {
  const categoriaCor = useMemo(() => CATEGORIA_CORES[licao.categoria] || "#6B46C1", [licao.categoria]);

  const intro = useMemo(() => renderIntro(licao.historia), [licao.historia]);

  return (
    <motion.article
      key={licao.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative cursor-pointer rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden flex flex-col min-h-[420px]"
      onClick={() => onClick(licao)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(licao);
      }}
      aria-label={`Abrir lição ${licao.titulo}`}
    >
      {/* Imagem da lição */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            licao.desenhoUrl ||
            "https://images.pexels.com/photos/8383676/pexels-photo-8383676.jpeg"
          }
          alt={`Imagem ilustrativa da lição ${licao.titulo}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onContextMenu={(e) => {
            if (licao.isPremium && userData?.status !== "premium" && !userData?.isAdmin) {
              e.preventDefault();
              toast.error("Função indisponível para contas Free.");
            }
          }}
        />

        {/* Overlay Premium */}
        {licao.isPremium && userData && userData.status !== "premium" && !userData.isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-4 p-4 text-center"
          >
            <Lock className="text-white w-10 h-10" />
            <p className="text-white text-sm font-medium">Conteúdo exclusivo para assinantes</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "/Upgrade"; // Ajuste para sua rota
              }}
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-md shadow-md transition"
            >
              Seja Premium
            </motion.button>
          </motion.div>
        )}

        {/* Badge de visto */}
        {jaVisto && <RibbonBadge text="Visto" type="diagonal" color="pink" icon />}

        {/* Badges canto superior */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {isNovo(licao.createdAt) && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-md animate-pulse-metal">
              New🚀
            </span>
          )}
          {/* Badge Premium só aparece se NÃO houver overlay bloqueado */}
          {licao.isPremium && (!userData || (userData.status === "premium" || userData.isAdmin)) && (
            <motion.div
              className="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 text-yellow-700 text-xs font-semibold shadow select-none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaCrown />
              Premium
            </motion.div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <Badge color={categoriaCor}>{licao.categoria}</Badge>

          <time
            dateTime={licao.createdAt.toISOString()}
            className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 select-none"
          >
            <Calendar size={14} />
            {formatarData(licao.createdAt)}
          </time>
        </div>

        <h2 className="text-lg font-semibold text-purple-700 mb-2 line-clamp-2">
          {licao.titulo}
        </h2>

        {intro}

        {/* Tags */}
        {Array.isArray(licao.tags) && licao.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {licao.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-purple-700 dark:text-white"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Botão Favoritar */}
        <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton itemId={licao.id} type="licoes" isPremium={licao.isPremium} />
        </div>
      </div>
    </motion.article>
  );
};

// ✅ Otimização com React.memo
export default React.memo(LessonCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.licao.id === nextProps.licao.id &&
    prevProps.jaVisto === nextProps.jaVisto &&
    prevProps.userData?.status === nextProps.userData?.status
  );
});
