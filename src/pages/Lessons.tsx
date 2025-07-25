import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowUp, X } from "lucide-react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import toast from "react-hot-toast";

import { useFilters } from "../hooks/useFilters";
import { useLessons } from "../hooks/useLessons"; // Hook customizado usando React Query
import { useAuth } from "../contexts/AuthContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useLicoesFiltradas } from "../hooks/useLicoesFiltradas";

import FilterBar from "../components/Lessons/FilterBar";
import LessonCard from "../components/Lessons/LessonCard";
import SearchInput from "../components/UI/SearchInput";

import { Licao, Categoria } from "../types";
import { analytics, logEvent } from "../services/firebase";

// ✅ Lista de categorias
const categoriasDisponiveis: Categoria[] = [
  "Kids",
  "Juniores",
  "Adolescentes",
  "Jovens",
  "Datas Festivas",
  "Outros Temas",
];

// ✅ Skeleton de carregamento
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded overflow-hidden h-64 w-full" />
);

export default function Lessons() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const loadingBarRef = useRef<LoadingBarRef>(null);

  // ✅ Estados do filtro
  const {
    inputValue,
    setInputValue,
    categoriaFiltro,
    setCategoriaFiltro,
    showPremiumOnly,
    setShowPremiumOnly,
    showFavoritosOnly,
    setShowFavoritosOnly,
    debouncedSearchTerm,
    limparFiltros,
  } = useFilters();

  // ✅ Hook que busca as lições com paginação infinita
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useLessons({ categoriaFiltro, showPremiumOnly, searchTerm: debouncedSearchTerm });

  // ✅ Extrair todas as lições de todas as páginas (corrigido tipo do "page")
  const licoes = data?.pages.flatMap((page) => page.items) || [];

  // ✅ Hook de Infinite Scroll
  const { sentinelRef } = useInfiniteScroll({
    canLoadMore: Boolean(hasNextPage),
    isLoading: isFetchingNextPage,
    onLoadMore: () => {
      if (hasNextPage) fetchNextPage();
    },
  });

  // ✅ Estados locais
  const [idsLicoesVistas, setIdsLicoesVistas] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const uid = localStorage.getItem("auth_uid");
      const key = `licoes_vistas_${uid}`;
      const salvo = localStorage.getItem(key);
      return salvo ? JSON.parse(salvo) : [];
    }
    return [];
  });

  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ✅ Contagem de favoritos (Firebase Query)
  useEffect(() => {
    const fetchFavoritosCount = async () => {
      if (!userData?.uid) return;
      try {
        const { getDocs, collection, where, query } = await import("firebase/firestore");
        const { db } = await import("../services/firebase");
        const q = query(collection(db, "licoes"), where("favoritadoPor", "array-contains", userData.uid));
        const snapshot = await getDocs(q);
        setTotalFavoritos(snapshot.size);
      } catch (err) {
        console.error("Erro ao buscar total de favoritos:", err);
      }
    };
    fetchFavoritosCount();
  }, [userData?.uid]);

  // ✅ Exibir botão "voltar ao topo" quando rolar a tela
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Filtrar lições (favoritos, busca, etc.)
  const filteredLicoes = useLicoesFiltradas({
    licoes,
    searchTerm: debouncedSearchTerm,
    showFavoritosOnly,
    userData,
  });

  // ✅ Função para clicar no card da lição
  const handleCardClick = (licao: Licao) => {
    const hasAccess = !licao.isPremium || userData?.status === "premium" || userData?.isAdmin;
    if (hasAccess) {
      registrarLicaoVista(licao.id);
      if (analytics) {
        logEvent(analytics, "click_licao", {
          licao_id: licao.id,
          titulo: licao.titulo,
          categoria: licao.categoria,
          isPremium: licao.isPremium,
        });
      }
      navigate(`/licao/${licao.id}`);
    } else {
      toast.error("Esta lição é exclusiva para assinantes premium.");
    }
  };

  // ✅ Registrar lição como "vista" no localStorage
  const registrarLicaoVista = (id: string) => {
    if (!idsLicoesVistas.includes(id)) {
      const novaLista = [...idsLicoesVistas, id];
      setIdsLicoesVistas(novaLista);
      if (userData?.uid) {
        localStorage.setItem(`licoes_vistas_${userData.uid}`, JSON.stringify(novaLista));
      }
    }
  };

  // ✅ Alternar filtro Premium
  const togglePremiumFilter = () => {
    if (!showPremiumOnly) {
      toast("Exibindo apenas lições Premium.", { icon: "⭐" });
    }
    setShowPremiumOnly(!showPremiumOnly);
  };

  return (
    <>
      <LoadingBar color="#9333ea" height={3} ref={loadingBarRef} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* 🔮 Tarja superior */}
        <div className="bg-purple-600 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <BookOpen className="text-white w-7 h-7" />
                <h1 className="text-3xl font-bold text-white">Lições</h1>
              </div>
              <p className="text-white/80 text-sm">
                Mostrando {filteredLicoes.length} de{" "}
                {showFavoritosOnly ? totalFavoritos : licoes.length}{" "}
                {filteredLicoes.length === 1 ? "lição" : "lições"}
              </p>
            </div>
            <div className="w-full sm:w-80">
              <SearchInput
                placeholder="Buscar lições..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 🎯 Barra de filtros */}
        <FilterBar
          categorias={categoriasDisponiveis}
          categoriaFiltro={categoriaFiltro}
          setCategoriaFiltro={setCategoriaFiltro}
          showPremiumOnly={showPremiumOnly}
          showFavoritosOnly={showFavoritosOnly}
          setShowFavoritosOnly={setShowFavoritosOnly}
          limparFiltros={limparFiltros}
          togglePremiumFilter={togglePremiumFilter}
        />

        {/* Chips dos filtros ativos */}
        <AnimatePresence>
          {(categoriaFiltro || showPremiumOnly || showFavoritosOnly) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              role="status"
              aria-live="polite"
              className="max-w-7xl mx-auto mt-3 text-sm text-gray-700 dark:text-gray-300 flex flex-wrap gap-2"
            >
              <span className="font-medium">Filtrando por:</span>
              {categoriaFiltro && (
                <span
                  className="bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-white px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                  onClick={() => setCategoriaFiltro(null)}
                  role="button"
                  aria-label="Remover filtro de categoria"
                >
                  📘 {categoriaFiltro} <X className="w-4 h-4" />
                </span>
              )}
              {showPremiumOnly && (
                <span
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                  onClick={togglePremiumFilter}
                  role="button"
                  aria-label="Remover filtro Premium"
                >
                  👑 Premium <X className="w-4 h-4" />
                </span>
              )}
              {showFavoritosOnly && (
                <span
                  className="bg-pink-100 text-pink-800 dark:bg-pink-600 dark:text-white px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                  onClick={() => setShowFavoritosOnly(false)}
                  role="button"
                  aria-label="Remover filtro Favoritos"
                >
                  ❤️ Favoritos <X className="w-4 h-4" />
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Conteúdo principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading */}
          {isLoading && licoes.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <p className="text-red-600 dark:text-red-400 text-center" role="alert">
              {(error as Error)?.message || "Erro ao carregar lições."}
            </p>
          ) : filteredLicoes.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              Nenhuma lição encontrada. Tente ajustar os filtros.
            </div>
          ) : (
            <motion.div
              key={`${categoriaFiltro}-${showPremiumOnly}-${showFavoritosOnly}-${debouncedSearchTerm}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredLicoes.map((licao) => {
                  const jaVisto = idsLicoesVistas.includes(licao.id);
                  return (
                    <motion.div
                      key={licao.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LessonCard
                        licao={licao}
                        jaVisto={jaVisto}
                        userData={userData}
                        onClick={handleCardClick}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Skeleton ao carregar mais */}
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={`loading-${i}`} />
                ))}
              </div>
              <div className="animate-spin w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Sentinela para infinite scroll */}
          {hasNextPage && <div ref={sentinelRef} className="h-4"></div>}

          {/* ✅ Corrigido: antes usava "hasMore" que não existia */}
          {!hasNextPage && !isLoading && filteredLicoes.length > 0 && (
            <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">
              ✅ Você chegou ao final das lições disponíveis.
            </div>
          )}

          {/* Botão voltar ao topo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showScrollTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
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
        </div>
      </div>
    </>
  );
}
