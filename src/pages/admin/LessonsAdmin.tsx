import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Crown,
  Calendar,
  Tag,
  MoreVertical,
  Filter,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Licao, CATEGORIA_CORES } from '../../types';
import { formatarData, isNovo } from '../../utils/date';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import Modal from '../../components/UI/Modal';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from "../../services/firebase";
import { doc, deleteDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const LessonsAdmin = () => {
  const { userData } = useAuth();
  const [licoes, setLicoes] = useState<Licao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [selectedLesson, setSelectedLesson] = useState<Licao | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
  const q = query(collection(db, 'licoes'), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const licoesFirestore = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    }) as Licao[];

    setLicoes(licoesFirestore);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const filteredLicoes = licoes.filter(licao => {
  const matchesSearch = licao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(licao.tags) &&
      licao.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));

  const matchesCategory = categoryFilter === 'todas' || licao.categoria === categoryFilter;
  const matchesStatus =
    statusFilter === 'todas' ||
    (statusFilter === 'premium' && licao.isPremium) ||
    (statusFilter === 'free' && !licao.isPremium);

  return matchesSearch && matchesCategory && matchesStatus;
});


  const handleDeleteLesson = async (lessonId: string) => {
  try {
    await deleteDoc(doc(db, 'licoes', lessonId));
    toast.success('Lição excluída com sucesso');
    setShowDeleteModal(false);
    setSelectedLesson(null);
  } catch (error) {
    console.error(error);
    toast.error('Erro ao excluir lição');
  }
};

  const togglePremiumStatus = async (lessonId: string) => {
  try {
    const licao = licoes.find(l => l.id === lessonId);
    if (!licao) return;

    const ref = doc(db, 'licoes', lessonId);
    await updateDoc(ref, {
      isPremium: !licao.isPremium
    });

    toast.success('Status premium atualizado');
  } catch (error) {
    console.error(error);
    toast.error('Erro ao atualizar status');
  }
};

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Esta área é restrita para administradores.
          </p>
          <Button onClick={() => window.history.back()}>
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header e Filtros */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-600">
                  Gerenciar Lições
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredLicoes.length} lições encontradas
                </p>
              </div>
            </div>
            
            <Link to="/adicionar-licao">
              <Button variant="primary" icon={Plus}>
                Nova Lição
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
             <input
                type="text"
                placeholder="Buscar lições..."
                value={searchTerm}
                onChange={(e) => {
                  console.log('Digitou:', e.target.value);
                  setSearchTerm(e.target.value);
                }}
                className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todas as categorias</option>
              <option value="Kids">Kids</option>
              <option value="Juniores">Juniores</option>
              <option value="Adolescentes">Adolescentes</option>
              <option value="Jovens">Jovens</option>
              <option value="Datas Festivas">Datas Festivas</option>
              <option value="Outros Temas">Outros Temas</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todos os status</option>
              <option value="free">Gratuitas</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

       {/* Estatísticas com ícones personalizados */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
  {/* Total de Lições */}
  <Card className="p-6 flex items-center bg-purple-200 dark:bg-purple-900 rounded-lg shadow-md">
    <BookOpen className="w-10 h-10 text-purple-700 dark:text-purple-400 mr-4" />
    <div>
      <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
        Total de Lições
      </div>
      <div className="text-4xl font-extrabold text-purple-700 dark:text-purple-400">
        {licoes.length}
      </div>
    </div>
  </Card>

  {/* Lições Premium */}
  <Card className="p-6 flex items-center bg-yellow-50 dark:bg-yellow-900 rounded-lg shadow-md">
    <Crown className="w-10 h-10 text-yellow-700 dark:text-yellow-400 mr-4" />
    <div>
      <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">
        Lições Premium
      </div>
      <div className="text-4xl font-extrabold text-yellow-700 dark:text-yellow-400">
        {licoes.filter(l => l.isPremium).length}
      </div>
    </div>
  </Card>

  {/* Total Filtradas */}
  <Card className="p-6 flex items-center bg-sky-100 dark:bg-sky-900 rounded-lg shadow-md">
   <Filter className="w-10 h-10 text-sky-700 dark:text-sky-400 mr-4" />
    <div>
      <div className="text-sm font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wide">
        Total Filtradas
      </div>
      <div className="text-4xl font-extrabold text-sky-700 dark:text-sky-400">
        {filteredLicoes.length}
      </div>
    </div>
  </Card>

  {/* Este Mês */}
  <Card
    className="p-6 flex items-center bg-fuchsia-100 dark:bg-fuchsia-700 rounded-lg shadow-md">
    <Calendar className="w-10 h-10 text-fuchsia-700 dark:text-fuchsia-300 mr-4" />
    <div>
      <div className="text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-300 uppercase tracking-wide">
        Este Mês
      </div>
      <div className="text-4xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">
        {
          licoes.filter(l => {
            const now = new Date();
            const created = new Date(l.createdAt);
            return (
              created.getMonth() === now.getMonth() &&
              created.getFullYear() === now.getFullYear()
            );
          }).length
        }
      </div>
    </div>
  </Card>
</div>
        {/* Lista estilo tabela */}
        {filteredLicoes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma lição encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou criar uma nova lição.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-purple-600 dark:bg-purple-600 text-white dark:text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Miniatura</th>
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Categoria</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Criada em</th>
                  <th className="px-4 py-2 text-left">Favoritos</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicoes.map((licao, index) => (
                  <motion.tr
                    key={licao.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={licao.desenhoUrl}
                        alt={licao.titulo}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-gray-600 dark:text-gray-400">{licao.titulo}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: CATEGORIA_CORES[licao.categoria] + '20',
                          color: CATEGORIA_CORES[licao.categoria]
                        }}
                      >
                        {licao.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {licao.isPremium ? (
                        <span className="inline-flex items-center text-yellow-600 font-semibold">
                          <Crown className="w-4 h-4 mr-1" />
                          Premium
                        </span>
                      ) : (
                        <span className="text-gray-500 font-medium">Gratuita</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {formatarData(licao.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
  {licao.favoritadoPor?.length ?? 0}
</td>
                    <td className="px-4 py-3 text-center space-x-1">
                      <Link
                        to={`/licao/${licao.id}`}
                        title="Visualizar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="inline-block w-5 h-5" />
                      </Link>
                      <Link
                        to={`/editar-licao/${licao.id}`}
                        title="Editar"
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit className="inline-block w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => togglePremiumStatus(licao.id)}
                        title={licao.isPremium ? 'Tornar Gratuita' : 'Tornar Premium'}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <Crown className="inline-block w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLesson(licao);
                          setShowDeleteModal(true);
                        }}
                        title="Excluir"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Exclusão */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
          size="sm"
        >
          {selectedLesson && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Tem certeza que deseja excluir a lição "{selectedLesson.titulo}"?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteLesson(selectedLesson.id)}
                  className="flex-1"
                >
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default LessonsAdmin;