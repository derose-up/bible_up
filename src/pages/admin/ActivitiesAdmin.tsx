import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Crown,
  Filter,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Atividade } from '../../types';
import { formatarData } from '../../utils/date';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

// Defina as cores para as categorias (exemplo)
const CATEGORIA_CORES: Record<string, string> = {
  'Desenhos para Colorir': '#EE1E2E',  // vermelho
  'Atividades para Imprimir': '#F76400',  // laranja
  // outras categorias, se houver...
};

const ActivitiesAdmin = () => {
  const { userData } = useAuth();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [selected, setSelected] = useState<Atividade | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todas');

  const navigate = useNavigate();

  const handleVisualizar = (atividadeId: string) => {
    navigate(`/atividade/${atividadeId}`);
  };

  useEffect(() => {
    const q = query(collection(db, 'atividades'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataFirestore = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
      }) as Atividade[];

      setAtividades(dataFirestore);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAtividades = atividades.filter(atividade => {
    const matchesSearch = (atividade.titulo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (Array.isArray(atividade.tags) &&
        atividade.tags.some(tag =>
          (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        ));

    const matchesCategoria = categoriaFilter === 'todas' || atividade.categoria === categoriaFilter;
    const matchesStatus =
      statusFilter === 'todas' ||
      (statusFilter === 'premium' && atividade.isPremium) ||
      (statusFilter === 'free' && !atividade.isPremium);

    return matchesSearch && matchesCategoria && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'atividades', id));
      toast.success('Atividade excluída');
      setShowDeleteModal(false);
      setSelected(null);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir');
    }
  };

  const togglePremium = async (id: string) => {
    try {
      const atividade = atividades.find((a) => a.id === id);
      if (!atividade) return;

      const ref = doc(db, 'atividades', id);
      await updateDoc(ref, {
        isPremium: !atividade.isPremium,
      });
      toast.success('Status premium atualizado');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status');
    }
  };

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="p-8 text-center max-w-md">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Esta área é restrita para administradores.
          </p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-gray-500 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header e filtros */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-purple-600">Gerenciar Atividades</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredAtividades.length} atividades encontradas
                </p>
              </div>
            </div>
            <Link to="/nova-atividade">
              <Button variant="primary" icon={Plus}>
                Nova Atividade
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Buscar atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todas as categorias</option>
              <option value="Desenhos para Colorir">Desenhos para Colorir</option>
              <option value="Atividades para Imprimir">Atividades para Imprimir</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todos os status</option>
              <option value="free">Gratuitas</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex items-center bg-purple-200 dark:bg-purple-900 rounded-lg shadow-md">
            <BookOpen className="w-10 h-10 text-purple-700 dark:text-purple-400 mr-4" />
            <div>
              <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Total de Atividades</div>
              <div className="text-4xl font-extrabold text-purple-700 dark:text-purple-400">{filteredAtividades.length}</div>
            </div>
          </Card>

          <Card className="p-6 flex items-center bg-yellow-50 dark:bg-yellow-900 rounded-lg shadow-md">
            <Crown className="w-10 h-10 text-yellow-700 dark:text-yellow-400 mr-4" />
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Atividades Premium</div>
              <div className="text-4xl font-extrabold text-yellow-700 dark:text-yellow-400">
                {atividades.filter((a) => a.isPremium).length}
              </div>
            </div>
          </Card>

          <Card className="p-6 flex items-center bg-sky-100 dark:bg-sky-900 rounded-lg shadow-md">
            <Filter className="w-10 h-10 text-sky-700 dark:text-sky-400 mr-4" />
            <div>
              <div className="text-sm font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wide">
                Total Filtradas
              </div>
              <div className="text-4xl font-extrabold text-sky-700 dark:text-sky-400">{filteredAtividades.length}</div>
            </div>
          </Card>

          <Card className="p-6 flex items-center bg-fuchsia-100 dark:bg-fuchsia-700 rounded-lg shadow-md">
            <Calendar className="w-10 h-10 text-fuchsia-700 dark:text-fuchsia-300 mr-4" />
            <div>
              <div className="text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-300 uppercase tracking-wide">
                Este Mês
              </div>
              <div className="text-4xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">
                {
                  atividades.filter((a) => {
                    const now = new Date();
                    const created = new Date(a.createdAt);
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

        {/* Tabela */}
        {filteredAtividades.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma atividade encontrada
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-purple-600 text-white">
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
                {filteredAtividades.map((a, index) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={a.imageUrl}
                        alt={a.titulo}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-gray-600 dark:text-gray-400">{a.titulo}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: CATEGORIA_CORES[a.categoria] + '20',
                          color: CATEGORIA_CORES[a.categoria]
                        }}
                      >
                        {a.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.isPremium ? (
                        <span className="inline-flex items-center text-yellow-600 font-semibold">
                          <Crown className="w-4 h-4 mr-1" />
                          Premium
                        </span>
                      ) : (
                        <span className="text-gray-500 font-medium">Gratuita</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatarData(a.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                      {a.favoritadoPor?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center space-x-1">
                    <Link to={`/atividade/${a.id}`} title="Visualizar" 
                      className="text-blue-600">
                      <Eye className="inline-block w-5 h-5" />
                    </Link>

                      <Link
                        to={`/editar-atividade/${a.id}`}
                        title="Editar"
                        className="text-green-600"
                      >
                        <Edit className="inline-block w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => togglePremium(a.id)}
                        title="Alternar Premium"
                        className="text-yellow-600"
                      >
                        <Crown className="inline-block w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelected(a);
                          setShowDeleteModal(true);
                        }}
                        title="Excluir"
                        className="text-red-600"
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

        {/* Modal de exclusão */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
          size="sm"
        >
          {selected && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Tem certeza que deseja excluir a atividade "{selected.titulo}"?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(selected.id)} className="flex-1">
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

export default ActivitiesAdmin;
