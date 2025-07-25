import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  ArrowUp,
  Crown,
  Calendar,
  FileText,
  User,
  Star,
  HeartHandshake
} from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Licao, CATEGORIA_CORES } from '../types';
import { formatarData } from '../utils/date';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { motion } from 'framer-motion';
import TopBarButtons from '../components/UI/TopBarButtons';

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [licao, setLicao] = useState<Licao | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

  
  useEffect(() => {
  const fetchLicao = async () => {
    if (!id) {
      navigate('/home'); 
      return;
    }
    try {
      const docRef = doc(db, 'licoes', id);
      const docSnap = await getDoc(docRef);  // <-- AQUI a variável docSnap é criada e usada

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<Licao> & { createdAt?: Timestamp };

        const licaoData: Licao = {
          id: docSnap.id,
          titulo: data.titulo || '',
          categoria: data.categoria || 'Outros Temas',
          isPremium: data.isPremium || false,
          nova: data.nova || false,
          historia: data.historia || '',
          aplicacao: data.aplicacao || '',
          dinamica: data.dinamica || '',
          atividade: data.atividade || '',
          oracao: data.oracao || '',
          desenhoUrl: data.desenhoUrl || '',
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), // <- Aqui o toDate é seguro pois data.createdAt é Timestamp
          tags: Array.isArray(data.tags) ? data.tags : [],
          favoritadoPor: Array.isArray(data.favoritadoPor) ? data.favoritadoPor : [],
        };

        setLicao(licaoData);
        setIsFavorited(licaoData.favoritadoPor.includes(userData?.uid || ''));
      } else {
        toast.error('Lição não encontrada');
        navigate('/home');
      }
    } catch (error) {
      console.error('Erro ao carregar lição:', error);
      toast.error('Erro ao carregar lição');
    } finally {
      setLoading(false);
      loadingBarRef.current?.complete();
    }
  };

  fetchLicao();
}, [id, navigate, userData?.uid]);

  const toggleFavorite = async () => {
  if (!licao || !userData || isUpdatingFavorite) return; // bloqueia se já estiver atualizando

  setIsUpdatingFavorite(true); // começa o loading

  try {
    const docRef = doc(db, 'licoes', licao.id);
    if (isFavorited) {
      await updateDoc(docRef, { favoritadoPor: arrayRemove(userData.uid) });
      setIsFavorited(false);
      toast.success('Removido dos favoritos');
    } else {
      await updateDoc(docRef, { favoritadoPor: arrayUnion(userData.uid) });
      setIsFavorited(true);
      toast.success('Adicionado aos favoritos');
    }
    setLicao(prev => prev ? {
      ...prev,
      favoritadoPor: isFavorited
        ? prev.favoritadoPor.filter(uid => uid !== userData.uid)
        : [...prev.favoritadoPor, userData.uid]
    } : null);
  } catch (error) {
    console.error('Erro ao favoritar:', error);
    toast.error('Erro ao favoritar lição');
  } finally {
    setIsUpdatingFavorite(false); // termina o loading
  }
};

  const handleShare = async () => {
  console.log('handleShare chamado');
  if (navigator.share) {
    try {
      await navigator.share({
        title: licao?.titulo,
        text: `Confira esta lição bíblica: ${licao?.titulo}`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado para a área de transferência');
  }
};


  const [showScrollTop, setShowScrollTop] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  const hasAccess =
    !licao?.isPremium || userData?.status === 'premium' || userData?.isAdmin;

  return (
    <>
      <LoadingBar color="#9333ea" height={3} ref={loadingBarRef} />

      {loading ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : !licao ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Lição não encontrada
            </h2>
            <Button onClick={() => navigate('/home')}>Voltar ao início</Button>
          </div>
        </div>
      ) : !hasAccess ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Conteúdo Premium
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta lição está disponível apenas para assinantes premium.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/upgrade')} className="w-full">
                Assinar Premium
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative pb-8 px-4 sm:px-6 lg:px-8">
          
          {/* Tarja com botões */}
          <TopBarButtons
            onBack={() => navigate(-1)}
            onToggleFavorite={toggleFavorite}
            onShare={handleShare}
            isFavorited={isFavorited}
            isUpdatingFavorite={isUpdatingFavorite}
            licao={licao}
          />

          {/* Conteúdo da Lição */}
          <div id="pdf-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-3xl mx-auto p-4 sm:p-6 border border-gray-200 dark:border-gray-700 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
            >
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-2">
                  {licao.titulo}
                  {licao.isPremium && (
                    <span role="img" aria-label="Conteúdo Premium" title="Conteúdo Premium">
                      <Crown
                        className="w-6 h-6 text-yellow-500 drop-shadow-md animate-pulse"
                      />
                    </span>
                  )}
                </h1>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formatarData(licao.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> {licao.favoritadoPor.length} favoritos
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: CATEGORIA_CORES[licao.categoria] + '20',
                      color: CATEGORIA_CORES[licao.categoria],
                    }}
                  >
                    {licao.categoria}
                  </span>
                </div>
              </div>
              {/* Seções da Lição */}
              <div className="text-gray-700 text-sm leading-relaxed space-y-6 relative z-10">
                {licao.historia && (
                  <Card className="mb-6 py-6 px-3 sm:px-4">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="pb-4"
                    >
                      <h2 className="text-purple-600 font-semibold text-xl lg:text-2xl flex items-center gap-2 mb-4 leading-none">
                        <BookOpen className="w-6 h-6 flex-shrink-0" />
                        <span className="shine-purple">História Bíblica</span>
                      </h2>
                      <ReactMarkdown className="prose prose-base sm:prose-base dark:prose-invert max-w-none w-full whitespace-pre-wrap">
                        {licao.historia}
                      </ReactMarkdown>
                    </motion.section>
                  </Card>
                )}

                <Card className="mb-6 py-6 px-3 sm:px-4">
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="pb-4"
                  >
                    <h2 className="text-green-600 font-semibold text-xl lg:text-2xl flex items-center gap-2 mb-4 leading-none">
                      <User className="w-6 h-6 flex-shrink-0" />
                      <span className="shine-green">Aplicação</span>
                    </h2>
                    <ReactMarkdown className="prose prose-base sm:prose-base dark:prose-invert max-w-none w-full whitespace-pre-wrap">
                      {licao.aplicacao}
                    </ReactMarkdown>
                  </motion.section>
                </Card>

                {licao.dinamica && (
                  <Card className="mb-6 py-6 px-3 sm:px-4">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="pb-4"
                    >
                      <h2 className="text-yellow-600 font-semibold text-xl lg:text-2xl flex items-center gap-2 mb-4 leading-none">
                        <Star className="w-6 h-6 flex-shrink-0" />
                        <span className="shine-yellow">Dinâmica</span>
                      </h2>
                      <ReactMarkdown className="prose prose-base sm:prose-base dark:prose-invert max-w-none w-full whitespace-pre-wrap">

                        {licao.dinamica}
                      </ReactMarkdown>
                    </motion.section>
                  </Card>
                )}

                {licao.atividade && (
                  <Card className="mb-6 py-6 px-3 sm:px-4">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="pb-4"
                    >
                      <h2 className="text-pink-600 font-semibold text-xl lg:text-2xl flex items-center gap-2 mb-4 leading-none">
                        <FileText className="w-6 h-6 flex-shrink-0" />
                        <span className="shine-pink">Atividade</span>
                      </h2>
                      <ReactMarkdown className="prose prose-base sm:prose-base dark:prose-invert max-w-none w-full whitespace-pre-wrap">
                        {licao.atividade}
                      </ReactMarkdown>
                    </motion.section>
                  </Card>
                )}

                {licao.oracao && (
                  <Card className="mb-6 py-6 px-3 sm:px-4">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="pb-4"
                    >
                      <h2 className="text-blue-600 font-semibold text-xl lg:text-2xl flex items-center gap-2 mb-4 leading-none">
                        <HeartHandshake className="w-6 h-6 flex-shrink-0" />
                        <span className="shine-blue">Oração</span>
                      </h2>
                      <ReactMarkdown className="prose prose-base sm:prose-base dark:prose-invert max-w-none w-full whitespace-pre-wrap">
                        {licao.oracao}
                      </ReactMarkdown>
                    </motion.section>
                  </Card>
                )}
              </div>
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showScrollTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </motion.div>
          </div>

          <div className="h-12" />
        </div>
      )}
    </>
  );
};

export default LessonDetail;