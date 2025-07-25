import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { Categoria } from "../../types";

type FilterBarProps = {
  categorias: Categoria[];
  categoriaFiltro: Categoria | null;
  setCategoriaFiltro: React.Dispatch<React.SetStateAction<Categoria | null>>;
  showPremiumOnly: boolean;
  showFavoritosOnly: boolean;
  setShowFavoritosOnly: (v: boolean) => void;
  limparFiltros: () => void;
  togglePremiumFilter: () => void;
};

const FilterBarComponent: React.FC<FilterBarProps> = ({
  categorias,
  categoriaFiltro,
  setCategoriaFiltro,
  showPremiumOnly,
  showFavoritosOnly,
  setShowFavoritosOnly,
  limparFiltros,
  togglePremiumFilter,
}) => {
  const baseBtn =
    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap";
  const defaultBtn =
    "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600";
  const activeBtn = "bg-purple-600 text-white shadow";

  // useCallback para evitar recriação de handlers
  const handleCategoriaClick = useCallback(
    (cat: Categoria) => {
      setCategoriaFiltro(cat === categoriaFiltro ? null : cat);
    },
    [categoriaFiltro, setCategoriaFiltro]
  );

  const handleFavoritosClick = useCallback(() => {
    setShowFavoritosOnly(!showFavoritosOnly);
  }, [showFavoritosOnly, setShowFavoritosOnly]);

  return (
    <div
      className="bg-gray-100 dark:bg-gray-800 py-3 px-4 sm:px-6 lg:px-8 shadow-sm border-b border-gray-200 dark:border-gray-700"
      role="region"
      aria-label="Filtros de lições"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar"
        tabIndex={0} // permite foco para navegação via teclado
        role="list"  // melhora a acessibilidade indicando lista de filtros
      >
        {/* Categorias */}
        {categorias.map((cat) => {
          const isActive = cat === categoriaFiltro;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={isActive}
              aria-label={`Filtrar por categoria ${cat}`}
              onClick={() => handleCategoriaClick(cat)}
              className={`${baseBtn} ${isActive ? activeBtn : defaultBtn}`}
              role="listitem"
            >
              {cat}
            </button>
          );
        })}

        {/* Favoritos */}
        <button
          type="button"
          aria-pressed={showFavoritosOnly}
          aria-label="Filtrar por favoritos"
          onClick={handleFavoritosClick}
          className={`${baseBtn} flex items-center gap-2 ${
            showFavoritosOnly ? activeBtn : defaultBtn
          }`}
          role="listitem"
        >
          <Heart className="w-4 h-4 text-red-600" />
          Favoritos
        </button>

        {/* Premium */}
        <button
          type="button"
          aria-pressed={showPremiumOnly}
          aria-label="Filtrar por Premium"
          onClick={togglePremiumFilter}
          className={`${baseBtn} flex items-center gap-2 ${
            showPremiumOnly ? activeBtn : defaultBtn
          }`}
          role="listitem"
        >
          <FaCrown className="text-yellow-500" />
          Premium
        </button>

        {/* Limpar filtros */}
        {(categoriaFiltro || showFavoritosOnly || showPremiumOnly) && (
          <button
            onClick={limparFiltros}
            aria-label="Limpar todos os filtros"
            className="ml-auto bg-purple-600 text-white text-sm px-4 py-2 rounded-full shadow hover:bg-purple-700 transition-colors"
          >
            Limpar
          </button>
        )}
      </motion.div>
    </div>
  );
};

// Otimização com React.memo e comparação customizada para evitar rerender desnecessário
export default React.memo(FilterBarComponent, (prev, next) => {
  return (
    prev.categoriaFiltro === next.categoriaFiltro &&
    prev.showPremiumOnly === next.showPremiumOnly &&
    prev.showFavoritosOnly === next.showFavoritosOnly &&
    prev.categorias.join(",") === next.categorias.join(",")
  );
});
