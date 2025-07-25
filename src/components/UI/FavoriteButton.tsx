import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  itemId: string;
  type: "licoes" | "atividades";
  isPremium: boolean;
}

const FavoriteButtonComponent: React.FC<FavoriteButtonProps> = ({ itemId, type, isPremium }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);
  const [favoritosCount, setFavoritosCount] = useState(0);

  // ✅ Evita recriar a função em cada render
  const fetchData = useCallback(async () => {
    try {
      const ref = doc(db, type, itemId);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data() as { favoritadoPor?: string[] };
        const lista = data.favoritadoPor || [];
        setFavoritosCount(lista.length);
        if (userData?.uid) {
          setIsFavorito(lista.includes(userData.uid));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    }
  }, [itemId, type, userData?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    if (!userData?.uid) {
      toast.error("Você precisa estar logado para favoritar!", { icon: "🔒" });
      return;
    }
    if (isPremium && userData.status !== "premium") {
      toast.error("Esse conteúdo é exclusivo para Premium!", { icon: "👑" });
      return;
    }

    try {
      setLoading(true);

      const ref = doc(db, type, itemId);

      if (isFavorito) {
        await updateDoc(ref, { favoritadoPor: arrayRemove(userData.uid) });
        setIsFavorito(false);
        setFavoritosCount((prev) => Math.max(0, prev - 1));
        toast("Removido dos favoritos ❌", { icon: "💔" });
      } else {
        await updateDoc(ref, { favoritadoPor: arrayUnion(userData.uid) });
        setIsFavorito(true);
        setFavoritosCount((prev) => prev + 1);
        toast.success("Adicionado aos favoritos!", { icon: "❤️" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar favorito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      disabled={loading}
      aria-pressed={isFavorito}
      aria-label={isFavorito ? "Desfavoritar" : "Favoritar"}
      className={`flex items-center gap-1 text-sm mt-2 ${
        isFavorito
          ? "text-red-500"
          : "text-gray-500 dark:text-gray-400 hover:text-red-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart
        aria-hidden="true"
        className={`w-5 h-5 ${isFavorito ? "fill-red-500" : "fill-none"}`}
      />
      {favoritosCount > 0 && <span>{favoritosCount}</span>}
    </motion.button>
  );
};

// ✅ Otimização com React.memo
const FavoriteButton = React.memo(FavoriteButtonComponent, (prev, next) => {
  return (
    prev.itemId === next.itemId &&
    prev.type === next.type &&
    prev.isPremium === next.isPremium
  );
});

export default FavoriteButton;
