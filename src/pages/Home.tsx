import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Book,
  Users,
  Star,
  Pencil,
  Palette,
  Calendar,
  Folder,
  Smile,
  ShieldCheck,
  Search,
  Heart,
  Crown,
  Lock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIA_CORES, Categoria, CategoriaAtividade } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Image3DInteractive from '../components/UI/Image3DInteractive';
import VersiculoRotativo from '../components/VersiculoRotativo';
import { Helmet } from 'react-helmet';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, ease: 'easeOut' },
  }),
};

const Home = () => {
  const { userData } = useAuth();

  const categorias = [
    { nome: 'Kids', icon: Smile, descricao: 'Histórias bíblicas encantadoras para os pequenos, de 3 a 6 anos, para iniciar a jornada da fé com amor e alegria.' },
    { nome: 'Juniores', icon: Book, descricao: 'Lições pensadas para crianças de 7 a 10 anos, despertando curiosidade e fortalecendo valores cristãos.' },
    { nome: 'Adolescentes', icon: Users, descricao: 'Conteúdo especial para adolescentes de 11 a 14 anos, que inspira escolhas sábias e fortalece a fé.' },
    { nome: 'Jovens', icon: ShieldCheck, descricao: 'Lições inspiradoras para jovens a partir de 15 anos, conectando fé, identidade e propósito.' },
    { nome: 'Datas Festivas', icon: Calendar, descricao: 'Lições temáticas para celebrar com fé e significado os momentos especiais do ano.' },
    { nome: 'Outros Temas', icon: Folder, descricao: 'Conteúdos diversos que ampliam o aprendizado e fortalecem a caminhada cristã em todas as idades.' }
  ];

  const atividades = [
    { nome: 'Desenhos para Colorir', icon: Palette, descricao: 'Desperte a criatividade e o amor pela Bíblia com desenhos especiais para colorir, que aproximam as crianças da Palavra.'  },
    { nome: 'Atividades para Imprimir', icon: Pencil, descricao: 'Materiais divertidos e educativos para imprimir, feitos com carinho para tornar cada momento de aprendizado inesquecível.' }
  ];

return (
    <>
      <Helmet>
        <title>BibleUp - Lições Bíblicas para Todas as Idades</title>
        <meta
          name="description"
          content="Explore conteúdos cristãos educativos para ensinar com fé, propósito e criatividade."
        />
      </Helmet>  

  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HERO */}
 <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Bem-vindo ao <span className="text-yellow-300">BibleUp</span>
      </h1>
      <p className="text-lg md:text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
        Torne cada aula um momento inesquecível com materiais criados com fé, amor e propósito.
      </p>
      </motion.div>

    {/* CARDS DE VALOR */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
      {[
        {
          icon: BookOpen,
          title: '+ de 300 Lições Bíblicas',
          text: 'Cada lição é uma oportunidade de tocar vidas com fé e criatividade.',
          color: '#f9a8d4', // rosa claro
          textColor: 'text-pink-300',
         },
        {
          icon: Star,
          title: 'Avaliação 5 estrelas',
          text: 'Educadores cristãos de todo o Brasil recomendam e se sentem apoiados.',
          color: '#facc15', // amarelo
        },
        {
          icon: Users,
          title: 'Feito por Educadores Cristãos',
          text: 'Criado com oração, experiência e amor por quem vive o chamado de ensinar.',
          color: '#6ee7b7', // verde claro
        },
      ].map((card, i) => (
        <motion.div
          key={i}
          variants={fadeInUp}
          custom={i}
          whileHover={{ scale: 1.04 }}
          className="rounded-xl border border-white/20 p-6 text-center shadow-md bg-white/10 backdrop-blur-sm"
        >
          <card.icon className="w-10 h-10 mb-4 mx-auto" style={{ color: card.color }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: card.color }}>
            {card.title}
          </h3>
          <p className="text-purple-100 text-sm">{card.text}</p>
        </motion.div>
        ))}
    </div>
  </div>
</section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-6 py-14"
      >
        {/* CATEGORIAS */}
        <motion.div variants={fadeInUp} className="mb-12">
  <h2 className="text-3xl font-bold text-purple-600 mb-2 flex items-center">
    <BookOpen className="w-7 h-7 mr-3 text-purple-600" />
    Lições Bíblicas por Categoria
  </h2>
  <p className="text-gray-600 dark:text-gray-400 mb-8">
    Escolha o conteúdo ideal para sua turma e ensine com inspiração e propósito.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categorias.map((cat, i) => {
              const corHex = CATEGORIA_CORES[cat.nome];
              const bgCor = corHex + '1A';
              const borderCor = corHex;

              return (
                <motion.div
                  key={cat.nome}
                  variants={fadeInUp}
                  custom={i}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to={`/licoes/${cat.nome.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div
                      className="p-6 h-full rounded-xl border-2 transition-all shadow-sm hover:shadow-xl"
                      style={{ backgroundColor: bgCor, borderColor: borderCor }}
                    >
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-4 border-4 bg-white"
                        style={{ borderColor: corHex }}
                      >
                        <cat.icon className="w-7 h-7" style={{ color: corHex }} />
                      </div>
                      <h3 
  className="text-xl font-semibold mb-1"
  style={{ color: corHex }}
>
  {cat.nome}
</h3>

                      <p className="text-gray-700 dark:text-gray-300">{cat.descricao}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
          </motion.div>

        {/* ATIVIDADES */}
<motion.div variants={fadeInUp} className="mb-20">
  <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-600 mb-8 flex items-center">
    <Palette className="w-7 h-7 mr-3 text-purple-600" />
    Atividades Educativas
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
    {atividades.map((ativ, i) => {
      const corHex = CATEGORIA_CORES[ativ.nome];
      const bgCor = corHex + '1A';
      const borderCor = corHex;

      return (
        <motion.div
          key={ativ.nome}
          variants={fadeInUp}
          custom={i}
          whileHover={{ scale: 1.05 }}
        >
          <Link to={`/atividades/${ativ.nome.toLowerCase().replace(/\s+/g, '-')}`}>
            <div
              className="p-6 h-full rounded-xl border-2 transition-all shadow-sm hover:shadow-xl"
              style={{ backgroundColor: bgCor, borderColor: borderCor }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 border-4 bg-white"
                style={{ borderColor: corHex }}
              >
                <ativ.icon className="w-7 h-7" style={{ color: corHex }} />
              </div>
              
              {/* TÍTULO COLORIDO IGUAL AO ÍCONE */}
              <h3
                className="text-xl font-semibold mb-1"
                style={{ color: corHex }}
              >
                {ativ.nome}
              </h3>

              <p className="text-gray-700 dark:text-gray-300">{ativ.descricao}</p>
            </div>
          </Link>
        </motion.div>
      );
    })}
  </div>
</motion.div>

    <hr className="my-12 border-t border-purple-200 dark:border-purple-800" />

       {/* AÇÕES RÁPIDAS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
  {/* Favoritos */}
  <Link to="/favoritos">
    <div
      className="p-8 text-center rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2"
      style={{ borderColor: '#ef4444' }} // Vermelho (text-red-500)
    >
      <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
      <h3
        className="text-2xl font-semibold mb-3"
        style={{ color: '#ef4444' }} // Vermelho
      >
        Meus Favoritos
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-lg max-w-xs mx-auto">
        Suas lições preferidas sempre à mão. Salve, acesse e ensine com amor.
      </p>
    </div>
  </Link>

  {/* Bônus */}
<Link to="/bonus">
  <div
    className="p-8 text-center rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2"
    style={{ borderColor: '#ca8a04' }} // Amarelo escuro (text-yellow-600)
  >
    <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4 animate-pulse" />
    <h3 className="text-2xl font-semibold mb-1 text-yellow-700">
      Conteúdo Bônus{' '}
      {userData?.status !== 'premium' && !userData?.isAdmin && (
        <Lock className="inline ml-2 w-5 h-5 text-yellow-600" />
      )}
    </h3>
    <p className="text-gray-700 dark:text-gray-300 text-lg max-w-xs mx-auto">
      {userData?.status === 'premium' || userData?.isAdmin
        ? 'Materiais preparados com fé e excelência para quem deseja ir além na missão de ensinar.'
        : 'Assine para desbloquear materiais exclusivos.'}
    </p>
  </div>
</Link>

  {/* Depoimentos */}
  <Link to="/depoimentos">
    <div
      className="p-8 text-center rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2"
      style={{ borderColor: '#3b82f6' }} // Azul (text-blue-500)
    >
      <Star className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
      <h3
        className="text-2xl font-semibold mb-3"
        style={{ color: '#3b82f6' }} // Azul
      >
        Depoimentos
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-lg max-w-xs mx-auto">
        Inspire-se com histórias reais de quem ensina com fé, propósito e coração.
      </p>
    </div>
     </Link>
    </div>
    </div>
  </>
);
};

export default Home;