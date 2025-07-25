import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import LoadingBar from "react-top-loading-bar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import ScrollTop from "../components/UI/ScrollTop";
import RibbonBadge from "../components/UI/RibbonBadge";
import FavoriteButton from "../components/UI/FavoriteButton";

interface Licao {
  id: string;
  titulo: string;
  imagem?: string;
  categoria: string;
  isPremium: boolean;
  resumo?: string;
}

const categorias = [
  "Todos",
  "Kids",
  "Juniores",
  "Adolescentes",
  "Jovens",
  "Datas Festivas",
  "Outros Temas",
];

const Licoes: React.FC = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showScroll, setShowScroll] = useState(false);
  const [licoes, setLicoes] = useState<Licao[]>([]);
  const [filtro, setFiltro] = useState("Todos");

  // Buscar lições no Firestore (toda vez que filtro muda)
  useEffect(() => {
    async function fetchLicoes() {
      setLoadingProgress(30);
      try {
        let q;
        const liacoesRef = collection(db, "licoes");

        if (filtro !== "Todos") {
          q = query(liacoesRef, where("categoria", "==", filtro));
        } else {
          q = query(liacoesRef);
        }

        const snapshot = await getDocs(q);
        const dados: Licao[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          titulo: doc.data().titulo,
          imagem: doc.data().imagem || "/default-image.jpg",
          categoria: doc.data().categoria,
          isPremium: doc.data().isPremium || false,
          resumo: doc.data().resumo || "Sem descrição",
        }));
        setLicoes(dados);
      } catch (error) {
        console.error("Erro ao carregar lições:", error);
      } finally {
        setLoadingProgress(100);
      }
    }

    fetchLicoes();
  }, [filtro]);

  // Mostrar botão scroll top ao passar de 300px
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Barra de carregamento no topo */}
      <LoadingBar
        color="#9333ea"
        progress={loadingProgress}
        onLoaderFinished={() => setLoadingProgress(0)}
      />

      {/* Tarja superior com título e contador */}
      <header className="bg-purple-600 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BookOpen className="text-white w-7 h-7" />
              <h1 className="text-3xl font-bold text-white">Lições</h1>
            </div>
            <p className="text-white/80 text-sm">
              Mostrando {licoes.length} lições
            </p>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
              ${
                filtro === cat
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid de cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {licoes.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden flex flex-col"
          >
            {item.isPremium && (
              <RibbonBadge text="Premium" type="corner" color="purple" icon />
            )}

            <img
              src={item.imagem}
              alt={item.titulo}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold text-purple-700 mb-2">
                {item.titulo}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
                {item.resumo}
              </p>

              <FavoriteButton
                itemId={item.id}
                type="licoes"
                isPremium={item.isPremium}
              />
            </div>
          </motion.article>
        ))}
      </main>

      {/* ScrollTop */}
      <ScrollTop visible={showScroll} />
    </div>
  );
};

export default Licoes;
