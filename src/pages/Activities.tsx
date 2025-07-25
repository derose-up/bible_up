import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Image, Calendar, ArrowUp, Heart, Lock } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getCountFromServer,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db, analytics, logEvent } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Atividade, CategoriaAtividade, CATEGORIA_CORES } from "../types";
import { formatarData, isNovo } from "../utils/date";
import toast from "react-hot-toast";
import { debounce, throttle } from "lodash";
import { useDebounce } from "../hooks/useDebounce";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import FavoriteButton from "../components/UI/FavoriteButton";

// 🔹 Componentes simples
const Input = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <input
    type="search"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:text-white"
  />
);

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded overflow-hidden h-64 w-full" />
);

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span
    style={{ backgroundColor: color + "20", color }}
    className="inline-block px-2 py-1 rounded-full text-xs font-semibold select-none"
  >
    {children}
  </span>
);

const categoriasDisponiveis: CategoriaAtividade[] = ["Desenhos para Colorir", "Atividades para Imprimir"];

const Activities = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const loadingBarRef = useRef<LoadingBarRef>(null);
  

  // Estados principais
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAtividades, setTotalAtividades] = useState(0);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [idsAtividadesVistas, setIdsAtividadesVistas] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const uid = localStorage.getItem('auth_uid');
      const key = `atividades_vistas_${uid}`;
      const salvo = localStorage.getItem(key);
      return salvo ? JSON.parse(salvo) : [];
    }
    return [];
  });

  // Controle de filtros
  const [inputValue, setInputValue] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  const debouncedCategoriaFiltro = useDebounce(categoriaFiltro, 300);
  const debouncedShowPremiumOnly = useDebounce(showPremiumOnly, 300);
  
  // Atualiza URL quando filtros mudam (com debounce)
  const updateParamsDebounced = useMemo(
    () =>
      debounce((categoria: string, premium: boolean, busca: string) => {
        const params = new URLSearchParams();
        if (categoria) params.set("categoria", categoria.toLowerCase().replace(/\s+/g, "-"));
        if (premium) params.set("premium", "true");
        if (busca.trim()) params.set("busca", busca.trim());
      setSearchParams(params);
      }, 300),
    [setSearchParams]
  );

  useEffect(() => {
    updateParamsDebounced(debouncedCategoriaFiltro, debouncedShowPremiumOnly, debouncedSearchTerm);

    if (analytics) {
      logEvent(analytics, "filtro_aplicado_atividades", {
        categoria: debouncedCategoriaFiltro,
        premium: debouncedShowPremiumOnly,
        busca: debouncedSearchTerm,
      });
    }
  }, [debouncedCategoriaFiltro, debouncedShowPremiumOnly, debouncedSearchTerm, updateParamsDebounced]);

  // Paginação
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const lastDocRef = useRef(lastDoc);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    lastDocRef.current = lastDoc;
  }, [lastDoc]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchAtividades = useCallback(
    async (isLoadMore = false) => {
      if (loadingMoreRef.current || (!hasMoreRef.current && isLoadMore)) return;

      if (!isLoadMore) {
        loadingBarRef.current?.continuousStart();
        setLoading(true);
        setLastDoc(null);
        setHasMore(true);
      }

      setLoadingMore(true);
      setError(null);

      try {
        const baseQuery = collection(db, "atividades");
        const constraints: QueryConstraint[] = [];

        if (categoriaFiltro) {
          constraints.push(where("categoria", "==", categoriaFiltro));
        }
        if (showPremiumOnly) {
          constraints.push(where("isPremium", "==", true));
        }

        constraints.push(orderBy("createdAt", "desc"));

        // Conta total
        const countConstraints = [...constraints].filter((c) => c.type !== "limit" && c.type !== "startAfter");
        const countQuery = query(baseQuery, ...countConstraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalAtividades(countSnapshot.data().count);

        // Paginação
        const LIMIT = 6;
        if (isLoadMore && lastDocRef.current) {
          constraints.push(startAfter(lastDocRef.current));
        }
        constraints.push(limit(LIMIT));

        const q = query(baseQuery, ...constraints);
        const snapshot = await getDocs(q);

        const newAtividades = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.();

          return {
            id: doc.id,
            ...data,
            createdAt: createdAt || new Date(),
          };
        }) as Atividade[];

        setAtividades((prev) => {
          if (!isLoadMore) return newAtividades;
          const idsExistentes = new Set(prev.map((a) => a.id));
          const novasUnicas = newAtividades.filter((a) => !idsExistentes.has(a.id));
          return [...prev, ...novasUnicas];
        });

        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === LIMIT);
      } catch (err: unknown) {
        console.error("Erro ao buscar atividades:", err);
        setError(err instanceof Error ? `Erro: ${err.message}` : "Erro ao carregar atividades. Tente novamente.");
      } finally {
        loadingBarRef.current?.complete();
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categoriaFiltro, showPremiumOnly]
  );

  // 🔥 Quando filtros mudam, resetar lista e buscar do zero
  useEffect(() => {
    setAtividades([]);
    setLastDoc(null);
    setHasMore(true);
    fetchAtividades(false);
  }, [fetchAtividades]);

  // Scroll infinito
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollTop = window.innerHeight + window.scrollY;
      const height = document.documentElement.offsetHeight;

      if (scrollTop >= height - 300 && !loading && hasMore) {
        fetchAtividades(true);
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchAtividades, loading, hasMore]);

 // Busca local com filtros combinados
const filteredAtividades = atividades.filter((a) => {
  const buscaLower = debouncedSearchTerm.toLowerCase();
  const tituloMatch = a.titulo.toLowerCase().includes(buscaLower);
  const tagsMatch =
    Array.isArray(a.tags) &&
    a.tags.some((tag) => tag.toLowerCase().includes(buscaLower));

  // Filtra por categoria
  if (categoriaFiltro && a.categoria !== categoriaFiltro) {
    return false;
  }

  // Filtra por premium
  if (showPremiumOnly && !a.isPremium) {
    return false;
  }

  // Filtra por favoritos
  if (showOnlyFavorites && userData?.uid) {
    if (!a.favoritadoPor?.includes(userData.uid)) {
      return false;
    }
  }

  // Filtra por busca
  return tituloMatch || tagsMatch;
});

     
const registrarAtividadeVista = (id: string) => {
  if (!idsAtividadesVistas.includes(id)) {
    const novaLista = [...idsAtividadesVistas, id];
    setIdsAtividadesVistas(novaLista);

    const uid = userData?.uid;
    if (uid) {
      localStorage.setItem(`atividades_vistas_${uid}`, JSON.stringify(novaLista));
    }
  }
};

  const limparFiltros = () => {
  setCategoriaFiltro("");
  setShowPremiumOnly(false);
  setShowOnlyFavorites(false); // ✅ agora limpa o filtro de favoritos
  toast.success("Filtros limpos com sucesso!");
};

  const togglePremiumFilter = () => {
    if (!showPremiumOnly) {
      toast("Exibindo apenas atividades Premium", { icon: "⭐" });
    }
    setShowPremiumOnly(!showPremiumOnly);
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContextMenu);
    return () => document.removeEventListener("contextmenu", blockContextMenu);
  }, []);

  return (
    <>
      <LoadingBar color="#9333ea" height={3} ref={loadingBarRef} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Top Bar */}
        <div className="bg-purple-600 dark:bg-purple-700 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Image className="text-white w-7 h-7" />
                <h1 className="text-3xl font-bold text-white">Atividades</h1>
              </div>
              <p className="text-white/80 text-sm">
                Mostrando {filteredAtividades.length} de {totalAtividades} {totalAtividades === 1 ? 'atividade' : 'atividades'}
              </p>
            </div>
            <div className="w-full sm:w-80">
              <Input placeholder="Buscar atividades..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-100 dark:bg-gray-800 py-4 px-4 sm:px-6 lg:px-8 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto flex flex-wrap items-center gap-3"
          >
            {categoriasDisponiveis.map((cat) => (
              <button
              type="button"
                key={cat}
                onClick={() => setCategoriaFiltro(cat === categoriaFiltro ? "" : cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  cat === categoriaFiltro
                    ? "bg-purple-600 text-white shadow"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-purple-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}

            <motion.button
              type="button"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`relative flex items-center gap-2 text-sm ml-2 px-3 py-1 rounded-full font-medium ${
                showOnlyFavorites
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-700 hover:bg-purple-500 hover:text-white"
              }`}
              aria-pressed={showOnlyFavorites}
              aria-checked={showOnlyFavorites}
              role="switch"
            >
              <Heart className="w-4 h-4 text-red-600 fill-current stroke-none" />
              Favoritos
            </motion.button>   

            {/* Switch premium */}
          <button
            type="button"
              onClick={togglePremiumFilter}
              className={`relative flex items-center gap-2 text-sm ml-2 px-3 py-1 rounded-full font-medium ${
                showPremiumOnly
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-700 hover:bg-purple-500 hover:text-white"
              }`}
            aria-pressed={showPremiumOnly}
            aria-checked={showPremiumOnly}
            role="switch"  
            >
              <FaCrown className="text-yellow-500" />
              Apenas Premium

            {/* Tooltip */}
              <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                Mostra apenas atividades para assinantes premium
              </span>
            </button>        

            <motion.button
              type="button"
              onClick={limparFiltros}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="ml-auto bg-purple-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-purple-700 transition-transform"
              aria-label="Limpar todos os filtros e buscar novamente"
            >
              Limpar filtros
            </motion.button>
          </motion.div>
        
        {/* Feedback de filtros ativos */}
          {(categoriaFiltro || showPremiumOnly || showOnlyFavorites) && (
            <div className="max-w-7xl mx-auto mt-3 text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Filtrando por:</span>{' '}
              {categoriaFiltro && <span className="mr-2">📘 <strong>{categoriaFiltro}</strong></span>}
              {showPremiumOnly && <span className="mr-2">👑 <strong>Premium</strong></span>}
              {showOnlyFavorites && <span className="mr-2">❤️ <strong>Favoritos</strong></span>}
            </div>
          )}
          </div>

        {/* Lista */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && atividades.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : filteredAtividades.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Nenhuma atividade encontrada. Tente ajustar os filtros.</div>
          ) : (
            <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
>
  {filteredAtividades.map((atividade, i) => {
   const jaVisto = idsAtividadesVistas.includes(atividade.id); // ✅ fora do return
          
    return (
      <motion.article
        key={atividade.id}
        onContextMenu={(e) => e.preventDefault()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.07 }}
        className={`relative cursor-pointer rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-hidden flex flex-col min-h-[420px]
                    ${jaVisto ? 'opacity-70 grayscale' : ''}
                  `}
        onClick={() => {
            if (!userData?.uid) {
             toast.error("Faça login para acessar as atividades.");
               return;
                 }
                   if (atividade.isPremium && userData.status === "free") {
                      toast.custom(
                        (t) => (
                          <div
                            className={`bg-gray-800 text-white px-4 py-3 rounded shadow-lg transform transition-all duration-300 ${
                              t.visible ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            🔒 Esta atividade é exclusiva para assinantes <strong>Premium</strong>.
                          </div>
                        ),
                        { duration: 3000 }
                      );
                      return;
                    }
            registrarAtividadeVista(atividade.id);
            navigate(`/atividade/${atividade.id}`);
          }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={atividade.imageUrl}
            alt={atividade.titulo}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Selo Visto */}
                    {jaVisto && (
                      <span className="absolute top-2 right-2 bg-green-600 text-white px-2 py-0.5 text-xs rounded flex items-center gap-1 select-none z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Visto
                      </span>
                    )}

          <div className="absolute top-2 left-2 flex flex-wrap gap-2"></div>
          {isNovo(atividade.createdAt) && (
          <span
          className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-md animate-pulse-metal"
          >
              Nova
            </span>
          )}
          {atividade.isPremium && (
            <motion.div
              className="absolute top-2 left-2 flex items-center gap-1 bg-white rounded-full px-2 py-0.5 text-yellow-700 text-xs font-semibold shadow select-none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaCrown />
              Premium
            </motion.div>
          )}
          {atividade.isPremium && userData?.status === "free" && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Lock className="text-white w-10 h-10" />
                </div>
                    )}        
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-1">
            <Badge color={CATEGORIA_CORES[atividade.categoria]}>{atividade.categoria}</Badge>
            <time className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={14} />
              {formatarData(atividade.createdAt)}
            </time>
          </div>
          <h2 className="text-lg font-semibold text-purple-700 mb-2 line-clamp-2">{atividade.titulo}</h2>
                   
        {/* Tags */} 
          {atividade.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {atividade.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-purple-700 dark:text-white"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ✅ Botão de Favoritar */}
            <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton
                      itemId={atividade.id}
                      type="atividades"
                      isPremium={atividade.isPremium}
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <motion.button
                    onClick={() => fetchAtividades(true)}
                    disabled={loadingMore}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                      loadingMore ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {loadingMore ? (
                            <div className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                ></path>
                              </svg>
                              Carregando...
                            </div>
                          ) : (
                            'Carregar mais atividades'
                          )}
                        </motion.button>
                      </div>
                    )}
                    
                    {!hasMore && !loading && filteredAtividades.length > 0 && (
                      <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">
                        ✅ Você chegou ao final das atividades disponíveis.
                      </div>
                    )}
                         </motion.div>
                          )}
             <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showScrollTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
          };

export default Activities;
