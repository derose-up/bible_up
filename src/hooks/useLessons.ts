import { useInfiniteQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { Licao, Categoria } from "../types";
import { useDebouncedValue } from "./useDebouncedValue";

const PAGE_SIZE = 6;

type LessonsPage = {
  items: Licao[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};

async function fetchLessons({
  pageParam,
  categoriaFiltro,
  showPremiumOnly,
  searchTerm,
}: {
  pageParam: QueryDocumentSnapshot<DocumentData> | null;
  categoriaFiltro: Categoria | null;
  showPremiumOnly: boolean;
  searchTerm: string;
}): Promise<LessonsPage> {
  const baseRef = collection(db, "licoes");
  const constraints: QueryConstraint[] = [];

  if (categoriaFiltro) constraints.push(where("categoria", "==", categoriaFiltro));
  if (showPremiumOnly) constraints.push(where("isPremium", "==", true));
  if (searchTerm.trim()) {
    constraints.push(where("titulo", ">=", searchTerm));
    constraints.push(where("titulo", "<=", searchTerm + "\uf8ff"));
  }

  constraints.push(orderBy("createdAt", "desc"));
  if (pageParam) constraints.push(startAfter(pageParam));
  constraints.push(limit(PAGE_SIZE));

  const q = query(baseRef, ...constraints);
  const snapshot = await getDocs(q);

  const items: Licao[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Licao[];

  return {
    items,
    lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
  };
}

export function useLessons(filters: {
  categoriaFiltro: Categoria | null;
  showPremiumOnly: boolean;
  searchTerm: string;
}) {
  const { categoriaFiltro, showPremiumOnly, searchTerm } = filters;
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  return useInfiniteQuery<LessonsPage, Error>({
    queryKey: ["licoes", categoriaFiltro, showPremiumOnly, debouncedSearch],
    queryFn: ({ pageParam }) =>
      fetchLessons({
        pageParam: pageParam as QueryDocumentSnapshot<DocumentData> | null,
        categoriaFiltro,
        showPremiumOnly,
        searchTerm: debouncedSearch,
      }),
    getNextPageParam: (lastPage) => lastPage.lastDoc || undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
