import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, BookOpen, Paintbrush, Search, Calendar } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Licao, Atividade, CATEGORIA_CORES } from "../types";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Input from "../components/Forms/Input";
import BadgePremium from "../components/UI/BadgePremium";
import { formatarData, isNovo } from "../utils/date";
import FavoriteButton from "../components/UI/FavoriteButton"; // import do botão favorito

const Favorites: React.FC = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<"licoes" | "atividades">("licoes");
  const [searchTerm, setSearchTerm] = useState("");
  const [licoesFavoritas, setLicoesFavoritas] = useState<Licao[]>([]);
  const [atividadesFavoritas, setAtividadesFavoritas] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData?.uid) {
        setLoading(false);
        return;
      }
      try {
        const licoesQuery = query(collection(db, "licoes"), where("favoritadoPor", "array-contains", userData.uid));
        const atividadesQuery = query(collection(db, "atividades"), where("favoritadoPor", "array-contains", userData.uid));

        const [licoesSnap, atividadesSnap] = await Promise.all([getDocs(licoesQuery), getDocs(atividadesQuery)]);

        const licoes = licoesSnap.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date()
        })) as Licao[];

        const atividades = atividadesSnap.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date()
        })) as Atividade[];

        setLicoesFavoritas(licoes);
        setAtividadesFavoritas(atividades);
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userData?.uid]);

  const filteredLicoes = licoesFavoritas.filter(l =>
    l.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAtividades = atividadesFavoritas.filter(a =>
    a.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
            <Heart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-purple-600">Meus Favoritos</h1>
            <p className="text-gray-500 dark:text-gray-400">Suas lições e atividades salvas em um só lugar</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1 w-fit mb-6">
          {["licoes", "atividades"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-gray-700 text-purple-600 shadow"
                  : "text-gray-600 dark:text-gray-400 hover:text-purple-500"
              }`}
            >
              {tab === "licoes" ? (
                <BookOpen className="inline w-4 h-4 mr-2" />
              ) : (
                <Paintbrush className="inline w-4 h-4 mr-2" />
              )}
              {tab === "licoes" ? `Lições (${licoesFavoritas.length})` : `Atividades (${atividadesFavoritas.length})`}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="mb-8 max-w-md">
          <Input
            type="text"
            placeholder="Buscar nos favoritos..."
            icon={Search}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Conteúdo */}
        {activeTab === "licoes" ? (
          filteredLicoes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-14 h-14 mx-auto mb-4 opacity-50" />
              Nenhuma lição encontrada
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLicoes.map((licao, index) => (
                <motion.div
                  key={licao.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg overflow-hidden"
                >
                  <Link to={`/licao/${licao.id}`}>
                    <img
                      src={licao.desenhoUrl || "https://via.placeholder.com/300"}
                      alt={licao.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <BadgePremium isPremium={licao.isPremium} className="absolute top-3 left-3" />
                  </Link>
                  <div className="p-4">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: CATEGORIA_CORES[licao.categoria] + "20",
                        color: CATEGORIA_CORES[licao.categoria]
                      }}
                    >
                      {licao.categoria}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-purple-600 line-clamp-2">{licao.titulo}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> {formatarData(licao.createdAt)}
                    </p>
                  </div>

                  {/* Botão Favorito */}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton itemId={licao.id} type="licoes" isPremium={licao.isPremium} />
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : filteredAtividades.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-14 h-14 mx-auto mb-4 opacity-50" />
            Nenhuma atividade encontrada
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAtividades.map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg overflow-hidden"
              >
                <Link to={`/atividade/${a.id}`}>
                  <img
                    src={a.imageUrl || "https://via.placeholder.com/300"}
                    alt={a.titulo}
                    className="w-full h-40 object-cover"
                  />
                  <BadgePremium isPremium={a.isPremium} className="absolute top-3 left-3" />
                </Link>
                <div className="p-3">
                  <h3 className="font-medium text-purple-600 line-clamp-2">{a.titulo}</h3>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: CATEGORIA_CORES[a.categoria] + "20",
                      color: CATEGORIA_CORES[a.categoria]
                    }}
                  >
                    {a.categoria}
                  </span>
                </div>

                {/* Botão Favorito */}
                <div className="absolute top-2 right-2">
                  <FavoriteButton itemId={a.id} type="atividades" isPremium={a.isPremium} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
