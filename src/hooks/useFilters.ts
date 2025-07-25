// src/hooks/useFilters.ts
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import { analytics, logEvent } from "../services/firebase";
import { Categoria } from "../types";

const formatarSlug = (slug: string | null): Categoria | null => {
  if (!slug || slug === "todas") return null; // ✅ Agora retorna null
  const comEspacos = slug.replace(/-/g, " ");
  const capitalizado = comEspacos.replace(/\b\w/g, (l) => l.toUpperCase());
  return capitalizado as Categoria;
};

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados principais
  const [inputValue, setInputValue] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<Categoria | null>(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showFavoritosOnly, setShowFavoritosOnly] = useState(false);

  // Captura valores da URL na primeira carga
  useEffect(() => {
    const categoriaParam = searchParams.get("categoria") || "";
    const premiumParam = searchParams.get("premium") === "true";
    const buscaParam = searchParams.get("busca") || "";
    const favoritosParam = searchParams.get("favoritos") === "true";

    setCategoriaFiltro(formatarSlug(categoriaParam));
    setShowPremiumOnly(premiumParam);
    setShowFavoritosOnly(favoritosParam);
    setInputValue(buscaParam.trim());
  }, [searchParams]);

  // Debounces
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  const debouncedCategoriaFiltro = useDebounce(categoriaFiltro, 300);
  const debouncedShowPremiumOnly = useDebounce(showPremiumOnly, 300);
  const debouncedShowFavoritosOnly = useDebounce(showFavoritosOnly, 300);

  // Atualiza URL de forma otimizada
  const updateParamsDebounced = useMemo(
    () =>
      debounce(
        (
          categoria: string,
          premium: boolean,
          favoritos: boolean,
          busca: string
        ) => {
          const params = new URLSearchParams();
          if (categoria)
            params.set("categoria", categoria.toLowerCase().replace(/\s+/g, "-"));
          if (premium) params.set("premium", "true");
          if (favoritos) params.set("favoritos", "true");
          if (busca.trim()) params.set("busca", busca.trim());
          setSearchParams(params);
        },
        300
      ),
    [setSearchParams]
  );

  // Dispara atualização e log no analytics
  useEffect(() => {
    updateParamsDebounced(
    debouncedCategoriaFiltro ?? "",
    debouncedShowPremiumOnly,
    debouncedShowFavoritosOnly,
    debouncedSearchTerm
  );

    if (analytics) {
      logEvent(analytics, "filtro_aplicado", {
        categoria: debouncedCategoriaFiltro,
        premium: debouncedShowPremiumOnly,
        busca: debouncedSearchTerm,
      });
    }
  }, [
    debouncedCategoriaFiltro,
    debouncedShowFavoritosOnly,
    debouncedShowPremiumOnly,
    debouncedSearchTerm,
    updateParamsDebounced,
  ]);

  return {
    inputValue,
    setInputValue,
    categoriaFiltro,
    setCategoriaFiltro,
    showPremiumOnly,
    setShowPremiumOnly,
    showFavoritosOnly,
    setShowFavoritosOnly,
    debouncedSearchTerm,
    limparFiltros: () => {
      setCategoriaFiltro(null);
      setShowPremiumOnly(false);
      setShowFavoritosOnly(false);
      setSearchParams(new URLSearchParams());
    },
  };
}
