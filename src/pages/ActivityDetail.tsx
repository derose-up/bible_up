import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from "firebase/firestore";
import { db, analytics, logEvent } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Atividade, CATEGORIA_CORES } from "../types";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Heart, Calendar, Tag } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";
import { formatarData } from "../utils/date";

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    const fetchAtividade = async () => {
      if (!id) return;

      try {
    const docRef = doc(db, "atividades", id);
    const docSnap = await getDoc(docRef);

       if (docSnap.exists()) {
      const data = docSnap.data();
      const atividade: Atividade = {
        id: docSnap.id,
        titulo: data.titulo,
        categoria: data.categoria,
        isPremium: data.isPremium,
        nova: data.nova,
        imageUrl: data.imageUrl,
        pdfUrl: data.pdfUrl,
        tags: data.tags || [],
        favoritadoPor: data.favoritadoPor || [],
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date()
      };

      setAtividade(atividade); // ✅ agora está sendo usado


          if (analytics) {
            logEvent(analytics, "visualizacao_atividade", { atividade_id: id });
          }
        } else {
          toast.error("Atividade não encontrada.");
          navigate("/atividades");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar atividade.");
      } finally {
        setLoading(false);
      }
    };

    fetchAtividade();
  }, [id, navigate]);

  useEffect(() => {
    if (atividade && userData?.uid) {
      setFavorito(atividade.favoritadoPor?.includes(userData.uid));
    }
  }, [atividade, userData]);

  const toggleFavorito = async () => {
    if (!userData?.uid) {
      toast.error("Faça login para favoritar esta atividade.");
      return;
    }

    if (!atividade) return;

    try {
      const ref = doc(db, "atividades", atividade.id);
      await updateDoc(ref, {
        favoritadoPor: favorito ? arrayRemove(userData.uid) : arrayUnion(userData.uid),
      });

      setFavorito(!favorito);

      setAtividade((prev) =>
        prev
          ? {
              ...prev,
              favoritadoPor: favorito
                ? prev.favoritadoPor.filter((id) => id !== userData.uid)
                : [...prev.favoritadoPor, userData.uid],
            }
          : prev
      );

      toast.success(favorito ? "Removido dos favoritos" : "Adicionado aos favoritos");

      if (analytics) {
        logEvent(analytics, "toggle_favorito_detalhe", {
          atividade_id: atividade.id,
          usuario_id: userData.uid,
          acao: favorito ? "desfavoritar" : "favoritar",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar favorito.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        Carregando...
      </div>
    );
  }

  if (!atividade) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        Atividade não encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-purple-600 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
          >
            <ArrowLeft /> Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">Detalhes da Atividade</h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Imagem */}
          <div className="relative">
            <img
              src={atividade.imageUrl}
              alt={atividade.titulo}
              className="w-full h-72 object-cover"
            />
            {atividade.isPremium && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-3 py-1 text-yellow-600 text-xs font-semibold shadow">
                <FaCrown /> Premium
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: CATEGORIA_CORES[atividade.categoria] + "20",
                  color: CATEGORIA_CORES[atividade.categoria],
                }}
              >
                {atividade.categoria}
              </span>
              <time className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={16} />
                {formatarData(atividade.createdAt)}
              </time>
            </div>

            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {atividade.titulo}
            </h2>

            {/* Tags */}
            {atividade.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {atividade.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-white px-2 py-1 rounded-full text-xs font-semibold"
                  >
                    <Tag size={14} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {atividade.pdfUrl && (
                <a
                  href={atividade.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition-colors"
                >
                  <Download size={18} /> Baixar PDF
                </a>
              )}
              <button
                onClick={toggleFavorito}
                className={`flex items-center gap-2 px-4 py-2 rounded shadow ${
                  favorito
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Heart className={`w-5 h-5 ${favorito ? "fill-white" : "fill-none"}`} />
                {favorito ? "Favorito" : "Favoritar"}
                {atividade.favoritadoPor?.length > 0 && (
                  <span className="ml-1 text-xs">
                    ({atividade.favoritadoPor.length})
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default ActivityDetail;
