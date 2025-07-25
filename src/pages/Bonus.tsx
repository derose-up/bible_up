// Bonus.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Download,
  Search,
  Filter,
  FileText,
  Image,
  Video,
  Music,
  Calendar,
  Tag,
  Gift,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/Forms/Input';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatarData } from '../utils/date';

interface MaterialBonus {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'pdf' | 'imagem' | 'video' | 'audio';
  categoria: string;
  fileUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  createdAt: Date;
  downloads: number;
}

const Bonus = () => {
  const { userData } = useAuth();
  const [materiais, setMateriais] = useState<MaterialBonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');

  const mockMateriais: MaterialBonus[] = [
    {
      id: '1',
      titulo: 'Guia Completo de Dinâmicas Bíblicas',
      descricao: 'Mais de 50 dinâmicas criativas para todas as idades',
      tipo: 'pdf',
      categoria: 'Dinâmicas',
      fileUrl: '#',
      thumbnailUrl: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg',
      tags: ['dinâmicas', 'criatividade', 'interação'],
      createdAt: new Date('2024-01-15'),
      downloads: 1250,
    },
    {
      id: '2',
      titulo: 'Músicas Infantis para EBD',
      descricao: 'Coletânea de 30 músicas com partituras e playbacks',
      tipo: 'audio',
      categoria: 'Música',
      fileUrl: '#',
      thumbnailUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
      tags: ['música', 'infantil', 'louvor'],
      createdAt: new Date('2024-01-10'),
      downloads: 890,
    },
    {
      id: '3',
      titulo: 'Vídeos Explicativos - Histórias Bíblicas',
      descricao: 'Série de vídeos animados das principais histórias bíblicas',
      tipo: 'video',
      categoria: 'Vídeos',
      fileUrl: '#',
      thumbnailUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      tags: ['vídeo', 'animação', 'histórias'],
      createdAt: new Date('2024-01-05'),
      downloads: 2100,
    },
    {
      id: '4',
      titulo: 'Kit de Ilustrações Bíblicas HD',
      descricao: 'Mais de 100 ilustrações em alta resolução',
      tipo: 'imagem',
      categoria: 'Ilustrações',
      fileUrl: '#',
      thumbnailUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
      tags: ['ilustrações', 'imagens', 'hd'],
      createdAt: new Date('2023-12-28'),
      downloads: 1560,
    },
    {
      id: '5',
      titulo: 'Planejamento Anual de Lições',
      descricao: 'Template completo para organizar suas aulas do ano todo',
      tipo: 'pdf',
      categoria: 'Planejamento',
      fileUrl: '#',
      thumbnailUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      tags: ['planejamento', 'organização', 'template'],
      createdAt: new Date('2023-12-20'),
      downloads: 780,
    },
    {
      id: '6',
      titulo: 'Jogos Bíblicos Interativos',
      descricao: 'Coletânea de jogos digitais para engajar os alunos',
      tipo: 'pdf',
      categoria: 'Jogos',
      fileUrl: '#',
      thumbnailUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg',
      tags: ['jogos', 'interativo', 'diversão'],
      createdAt: new Date('2023-12-15'),
      downloads: 1340,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setMateriais(mockMateriais);
      setLoading(false);
    }, 1000);
  }, []);

  const categorias = ['todos', 'Dinâmicas', 'Música', 'Vídeos', 'Ilustrações', 'Planejamento', 'Jogos'];
  const tipos = ['todos', 'pdf', 'imagem', 'video', 'audio'];

  const filteredMateriais = materiais.filter((material) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      material.titulo.toLowerCase().includes(search) ||
      material.descricao.toLowerCase().includes(search) ||
      material.tags.some((tag) => tag.toLowerCase().includes(search));

    const matchesCategory = selectedCategory === 'todos' || material.categoria === selectedCategory;
    const matchesType = selectedType === 'todos' || material.tipo === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
        return FileText;
      case 'imagem':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      default:
        return FileText;
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
        return 'text-red-600 bg-red-100';
      case 'imagem':
        return 'text-green-600 bg-green-100';
      case 'video':
        return 'text-blue-600 bg-blue-100';
      case 'audio':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner topo */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Conteúdo <span className="text-yellow-200">Bônus</span> Premium
            </h1>
            <p className="text-lg text-orange-100 max-w-2xl mx-auto">
              Acesse recursos exclusivos e impulsione suas aulas com materiais incríveis!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header e filtros */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-600">Materiais Bônus</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Conteúdo exclusivo para assinantes premium
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Buscar materiais..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria === 'todos' ? 'Todas as categorias' : categoria}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo === 'todos' ? 'Todos os tipos' : tipo.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista */}
        {filteredMateriais.length === 0 ? (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum material encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMateriais.map((material, index) => {
              const TypeIcon = getTypeIcon(material.tipo);
              const isPremium = userData?.status === 'premium' || userData?.isAdmin;

              return (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="overflow-hidden h-full">
                    <div className="relative">
                      <img
                        src={material.thumbnailUrl}
                        alt={material.titulo}
                        className="w-full h-48 object-cover"
                      />
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center ${getTypeColor(material.tipo)}`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {material.tipo.toUpperCase()}
                      </div>
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {material.categoria}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatarData(material.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-600 mb-2 line-clamp-2">
                        {material.titulo}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {material.descricao}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {material.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Download className="w-4 h-4 mr-1" />
                          {material.downloads.toLocaleString()}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          icon={Download}
                          onClick={() => {
                            if (isPremium) {
                              window.open(material.fileUrl, '_blank');
                            } else {
                              toast.error('Este material é exclusivo para assinantes Premium. Faça o upgrade para acessar.');
                            }
                          }}
                        >
                          Visualizar
                        </Button>

                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Próximos Lançamentos */}
        <div className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-purple-600 dark:text-purple-600 mb-2">
              Próximos Lançamentos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Novos materiais disponíveis em breve
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards de lançamentos futuros */}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="p-6 text-center">
                <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Kit Especial de Férias
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Atividades temáticas para o período de férias
                </p>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">
                  Em breve
                </span>
              </div>
            </Card>
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="p-6 text-center">
                <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Série Parábolas de Jesus
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Lições visuais baseadas nas parábolas bíblicas
                </p>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">
                  Julho 2024
                </span>
              </div>
            </Card>
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="p-6 text-center">
                <Gift className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cartazes de Boas-vindas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Decorações para recepção de alunos
                </p>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">
                  Agosto 2024
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bonus;
