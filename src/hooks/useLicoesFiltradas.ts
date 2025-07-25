import { useMemo } from "react";
import { Licao, Usuario } from "../types";

interface Params {
  licoes: Licao[];
  searchTerm: string;
  showFavoritosOnly: boolean;
  userData: Usuario | null;
}

export function useLicoesFiltradas({
  licoes,
  searchTerm,
  showFavoritosOnly,
  userData,
}: Params) {
  return useMemo(() => {
    const buscaLower = searchTerm.toLowerCase();

    return licoes.filter((licao) => {
      const tituloMatch = licao.titulo.toLowerCase().includes(buscaLower);
      const tagsMatch =
        Array.isArray(licao.tags) &&
        licao.tags.some((tag) => tag.toLowerCase().includes(buscaLower));

      if (showFavoritosOnly) {
        if (!userData?.uid) return false;
        if (!licao.favoritadoPor?.includes(userData.uid)) return false;
      }

      return tituloMatch || tagsMatch;
    });
  }, [licoes, searchTerm, showFavoritosOnly, userData]);
}
