import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfLicao from 'components/pdf/PdfLicao'; // ajuste o caminho se necessário
import { Licao } from '../../types'; // ✅ ajuste o caminho corretamente

interface TopBarButtonsProps {
  isFavorited: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
  isUpdatingFavorite: boolean; 
  licao: Licao;
}

const TopBarButtons: React.FC<TopBarButtonsProps> = ({
  isFavorited,
  onBack,
  onToggleFavorite,
  onShare,
  isUpdatingFavorite,
  licao,
}) => {
  const btnBaseClasses = "p-2 rounded-md cursor-pointer flex items-center justify-center transition-colors";

  return (
    <div className="bg-purple-600 py-8 px-4 sm:px-6 lg:px-8 mb-2 flex justify-center max-w-7xl mx-auto gap-6">
      {/* Voltar */}
      <motion.button
        onClick={onBack}
        title="Voltar"
        aria-label="Voltar"
        whileHover={{ scale: 1.1 }}
        className={`${btnBaseClasses} text-white border border-white hover:bg-purple-700`}
      >
        <ArrowLeft size={24} />
      </motion.button>

      {/* Favoritar */}
      <motion.button
      onClick={onToggleFavorite}
      disabled={isUpdatingFavorite}  // desabilita enquanto atualiza
      title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      whileHover={{ scale: isUpdatingFavorite ? 1 : 1.1 }}
      className={`${btnBaseClasses} text-white border border-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Heart size={24} fill={isFavorited ? 'red' : 'none'} stroke="currentColor" />
    </motion.button>

      {/* Compartilhar */}
      <button
  onClick={() => {
    console.log('Botão compartilhar clicado');
    onShare();
  }}
  title="Compartilhar"
  aria-label="Compartilhar"
  className={`${btnBaseClasses} text-white border border-white hover:bg-purple-700`}
>
  <Share2 size={24} />
</button>



      {/* Gerar PDF */}
      <motion.div whileHover={{ scale: 1.1 }}>
  <PDFDownloadLink
    document={<PdfLicao licao={licao} />}
    fileName={`${licao.titulo}.pdf`}
  >
    {() => (
      <button
        title="Download PDF"
        aria-label="Download PDF"
        className={`${btnBaseClasses} text-white border border-white hover:bg-purple-700`}
      >
        <Download size={24} />
      </button>
    )}
  </PDFDownloadLink>
</motion.div>
    </div>
  );
};

export default TopBarButtons;