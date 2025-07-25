// src/hooks/useInfiniteScroll.ts
import { useEffect, useRef } from "react";

type UseInfiniteScrollProps = {
  canLoadMore: boolean; // se ainda tem mais itens
  isLoading: boolean;   // se está carregando no momento
  onLoadMore: () => void; // função chamada para carregar mais
};

export function useInfiniteScroll({ canLoadMore, isLoading, onLoadMore }: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    // Desconecta o observer anterior para evitar múltiplas instâncias
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && canLoadMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" } // dispara antes do usuário chegar no fim
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [canLoadMore, isLoading, onLoadMore]);

  return { sentinelRef };
}
