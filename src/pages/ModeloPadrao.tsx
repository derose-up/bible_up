import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import LoadingBar from "react-top-loading-bar";
import ScrollTop from "../components/UI/ScrollTop";
import RibbonBadge from "../components/UI/RibbonBadge";
import FavoriteButton from "../components/UI/FavoriteButton";

const ModeloPadrao: React.FC = () => {
  // Estado para controlar a barra de loading no topo
  const [progress, setProgress] = useState(0);

  // Estado para mostrar/ocultar botão de scroll para topo
  const [showScroll, setShowScroll] = useState(false);

  // Simulação de carregamento inicial
  useEffect(() => {
    setProgress(30); // inicia a barra em 30%
    setTimeout(() => setProgress(100), 800); // completa a barra depois de 0.8s
  }, []);

  // Listener para exibir o botão scroll top após descer 300px na tela
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exemplo de dados estáticos; na sua página real, substitua por fetch do Firestore
  const items = [
    { id: "1", titulo: "Lição Exemplo 1", imagem: "/img1.jpg", isPremium: true },
    { id: "2", titulo: "Lição Exemplo 2", imagem: "/img2.jpg", isPremium: false },
    { id: "3", titulo: "Lição Exemplo 3", imagem: "/img3.jpg", isPremium: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Barra de carregamento no topo da página */}
      <LoadingBar
        color="#9333ea"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      {/* Tarja superior com título e contador */}
      <header className="bg-purple-600 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BookOpen className="text-white w-7 h-7" />
              <h1 className="text-3xl font-bold text-white">Título da Página</h1>
            </div>
            <p className="text-white/80 text-sm">
              Mostrando {items.length} de {items.length} itens
            </p>
          </div>
        </div>
      </header>

      {/* Seção de filtros - substitua com seus filtros reais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
        {/* Exemplo de botão filtro ativo */}
        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold hover:bg-purple-200">
          Todos
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
          Kids
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
          Juniores
        </button>
      </section>

      {/* Área principal com cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden flex flex-col"
          >
            {/* Badge premium no canto se for conteúdo premium */}
            {item.isPremium && (
              <RibbonBadge text="Premium" type="corner" color="purple" icon />
            )}

            {/* Imagem do card */}
            <img
              src={item.imagem}
              alt={item.titulo}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-purple-700 mb-2">
                {item.titulo}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                Breve descrição do item...
              </p>

              {/* Botão para favoritar, bloqueia para usuários free se isPremium */}
              <FavoriteButton
                itemId={item.id}
                type="licoes"
                isPremium={item.isPremium}
              />
            </div>
          </motion.article>
        ))}
      </main>

      {/* Botão Scroll Top fixo que aparece conforme o scroll */}
      <ScrollTop visible={showScroll} />
    </div>
  );
};

export default ModeloPadrao;
