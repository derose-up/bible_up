import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  Filter,
  Crown,
  Shield,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Usuario } from '../../types';
import { formatarData } from '../../utils/date';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import Modal from '../../components/UI/Modal';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Users = () => {
  const { userData } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'free' | 'premium'>('todos');
  const [igrejaFilter, setIgrejaFilter] = useState('todas');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
      const lista = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          ...data,
          dataCadastro: data.dataCadastro?.toDate?.() ?? new Date(),
          ultimoAcesso: data.ultimoAcesso?.toDate?.() ?? new Date(),
          atualizadoEm: data.atualizadoEm?.toDate?.() ?? new Date(),
          updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
        };
      });
      setUsuarios(lista);
      setLoading(false);
    });

    return () => unsub(); // limpa o listener
  }, []);

  // Extrair lista de igrejas únicas para filtro
  const igrejasUnicas = Array.from(new Set(usuarios.map(u => u.igreja).filter(Boolean)));

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.igreja.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || usuario.status === statusFilter;

    const matchesIgreja = igrejaFilter === 'todas' || usuario.igreja === igrejaFilter;

    return matchesSearch && matchesStatus && matchesIgreja;
  });

  const handleSaveUserData = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'usuarios', selectedUser.uid);
      await updateDoc(userRef, {
        preferenciasConteudo: selectedUser.preferenciasConteudo || [],
        concordaReceberEmail: selectedUser.concordaReceberEmail || false,
        concordaReceberWhatsapp: selectedUser.concordaReceberWhatsapp || false,
        atualizadoEm: new Date(),
      });
      toast.success('Informações do usuário atualizadas');
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar dados do usuário');
    }
  };
  
  const handleStatusChange = async (userId: string, newStatus: 'free' | 'premium') => {
    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        status: newStatus,
        atualizadoEm: new Date(),
      });
      toast.success(`Status do usuário atualizado para ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status do usuário');
    }
  };

  const handleAdminToggle = async (userId: string, isAdmin: boolean) => {
    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        isAdmin,
        atualizadoEm: new Date(),
      });
      toast.success(`Permissões de admin ${isAdmin ? 'concedidas' : 'removidas'}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar permissões');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      // Simular exclusão
      setUsuarios(prev => prev.filter(user => user.uid !== userId));
      toast.success('Usuário excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    }
  };

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-purple-600">
                  Gerenciar Usuários
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredUsuarios.length} usuários encontrados
                </p>
              </div>
            </div>
            {/* Poderia incluir botão Novo Usuário se quiser */}
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Buscar usuários..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'todos' | 'free' | 'premium')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todos">Todos os status</option>
              <option value="free">Gratuito</option>
              <option value="premium">Premium</option>
            </select>

            <select
              value={igrejaFilter}
              onChange={(e) => setIgrejaFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todas as igrejas</option>
              {igrejasUnicas.map((igreja) => (
                <option key={igreja} value={igreja}>{igreja}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex items-center bg-purple-200 dark:bg-purple-900 rounded-lg shadow-md">
            <UsersIcon className="w-10 h-10 text-purple-700 dark:text-purple-400 mr-4" />
            <div>
              <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Total de Usuários</div>
              <div className="text-4xl font-extrabold text-purple-700 dark:text-purple-400">{usuarios.length}</div>
            </div>
          </Card>
          <Card className="p-6 flex items-center bg-yellow-50 dark:bg-yellow-900 rounded-lg shadow-md">
            <Crown className="w-10 h-10 text-yellow-700 dark:text-yellow-400 mr-4" />
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Usuários Premium</div>
              <div className="text-4xl font-extrabold text-yellow-700 dark:text-yellow-400">
                {usuarios.filter(u => u.status === 'premium').length}
              </div>
            </div>
          </Card>
          <Card className="p-6 flex items-center bg-sky-100 dark:bg-sky-900 rounded-lg shadow-md">
  <Filter className="w-10 h-10 text-sky-700 dark:text-sky-400 mr-4" />
  <div>
    <div className="text-sm font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wide">Total Filtrados</div>
    <div className="text-4xl font-extrabold text-sky-700 dark:text-sky-400">
      {filteredUsuarios.length}
    </div>
  </div>
</Card>

<Card className="p-6 flex items-center bg-fuchsia-100 dark:bg-fuchsia-700 rounded-lg shadow-md">
  <Calendar className="w-10 h-10 text-fuchsia-700 dark:text-fuchsia-300 mr-4" />
  <div>
    <div className="text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-300 uppercase tracking-wide">Este mês</div>
    <div className="text-4xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">
      {usuarios.filter(u => {
        const data = u.dataCadastro;
        const agora = new Date();
        return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
      }).length}
    </div>
  </div>
</Card>
 </div>
        
        {/* Lista de Usuários */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Igreja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsuarios.map((usuario, index) => (
                  <motion.tr
                    key={usuario.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {usuario.fotoPerfil ? (
                          <img
                            src={usuario.fotoPerfil}
                            alt={usuario.nome}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                            <UsersIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {usuario.nome}
                            {usuario.isAdmin && (
                              <Shield className="w-4 h-4 text-purple-600 ml-2" title="Administrador" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {usuario.funcaoMinisterial}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {usuario.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {usuario.whatsapp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {usuario.igreja}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          usuario.status === 'premium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {usuario.status === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                          {usuario.status === 'premium' ? 'Premium' : 'Gratuito'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatarData(usuario.dataCadastro)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Último acesso: {formatarData(usuario.ultimoAcesso)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                     <div className="px-4 py-3 items-center space-x-1">
                        {/* Botão Visualizar */}
                        <Button
                          variant="text-blue-600"
                          size="sm"
                          title="Visualizar usuário"
                          onClick={() => {
                            setSelectedUser(usuario);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600"
                        >
                          <Eye className="inline-block w-5 h-5" />
                        </Button>

                       {/* Botão Status */}
                      <Button
                        variant="ghost"
                        size="sm"
                        title={`Tornar ${usuario.status === 'premium' ? 'Gratuito' : 'Premium'}`}
                        onClick={() =>
                          handleStatusChange(usuario.uid, usuario.status === 'premium' ? 'free' : 'premium')
                        }
                        className={`${
                          usuario.status === 'premium'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white'
                        } border border-transparent hover:border-gray-300 transition-all`}
                      >
                        <Crown className="inline-block w-5 h-5" />
                      </Button>

                        {/* Botão Editar */}
                          <Button
                            variant="text-green-600"
                            title="Editar usuário"
                            onClick={() => {
                              setSelectedUser(usuario);
                              setShowModal(true); 
                            }}
                          >
                            <Edit className="inline-block w-5 h-5 text-green-600" />
                          </Button>
                        
                        {/* Botão Excluir */}
                        <Button
                          variant="text-red-600"
                          size="sm"
                          title="Excluir usuário"
                          onClick={() => handleDeleteUser(usuario.uid)}
                        >
                          <Trash2 className="inline-block w-5 h-5 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal de Edição */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Editar Usuário"
          size="md"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {selectedUser.fotoPerfil ? (
                  <img
                    src={selectedUser.fotoPerfil}
                    alt={selectedUser.nome}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedUser.nome}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
        
              {/* Status e Admin */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) =>
                      handleStatusChange(selectedUser.uid, e.target.value as 'free' | 'premium')
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="free">Gratuito</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
        
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Administrador
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleAdminToggle(selectedUser.uid, !selectedUser.isAdmin)
                      }
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedUser.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedUser.isAdmin ? (
                        <UserCheck className="w-4 h-4" />
                      ) : (
                        <UserX className="w-4 h-4" />
                      )}
                      <span>{selectedUser.isAdmin ? 'Admin' : 'Usuário'}</span>
                    </button>
                  </div>
                </div>
              </div>
        
              {/* Preferências de conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferências de Conteúdo
                </label>
                <input
                  type="text"
                  value={(selectedUser.preferenciasConteudo || []).join(', ')}
                  onChange={(e) => {
                    const lista = e.target.value.split(',').map((s) => s.trim());
                    setSelectedUser((prev) => prev && { ...prev, preferenciasConteudo: lista });
                  }}
                  placeholder="Ex: Desenhos, Kids, Datas Festivas"
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
        
              {/* Consentimentos */}
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUser.concordaReceberEmail || false}
                    onChange={(e) =>
                      setSelectedUser((prev) =>
                        prev ? { ...prev, concordaReceberEmail: e.target.checked } : prev
                      )
                    }
                  />
                  <span className="text-sm">Aceita E-mails</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUser.concordaReceberWhatsapp || false}
                    onChange={(e) =>
                      setSelectedUser((prev) =>
                        prev ? { ...prev, concordaReceberWhatsapp: e.target.checked } : prev
                      )
                    }
                  />
                  <span className="text-sm">Aceita WhatsApp</span>
                </label>
              </div>
        
              {/* Botão de salvar alterações */}
              <Button
                variant="default"
                onClick={handleSaveUserData}
                className="w-full"
              >
                Salvar Alterações
              </Button>
        
              {/* Botão de excluir usuário */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <Button
                  variant="danger"
                  icon={Trash2}
                  onClick={() => {
                    handleDeleteUser(selectedUser.uid);
                    setShowModal(false);
                  }}
                  className="w-full"
                >
                  Excluir Usuário
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de Visualização */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Detalhes do Usuário"
          size="md"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                {selectedUser.fotoPerfil ? (
                  <img
                    src={selectedUser.fotoPerfil}
                    alt={selectedUser.nome}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser.nome}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedUser.funcaoMinisterial}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 dark:text-white">{selectedUser.whatsapp}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 dark:text-white">{selectedUser.isAdmin ? 'Administrador' : 'Usuário Comum'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">{selectedUser.status === 'premium' ? 'Premium' : 'Gratuito'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900 dark:text-white">Cadastro: {formatarData(selectedUser.dataCadastro)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">Último Acesso: {formatarData(selectedUser.ultimoAcesso)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 dark:text-white">Igreja: {selectedUser.igreja}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 dark:text-white">
                    Preferências: {(selectedUser.preferenciasConteudo || []).join(', ') || 'Nenhuma'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUser.concordaReceberEmail || false}
                    readOnly
                    className="cursor-not-allowed"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">Aceita E-mails</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUser.concordaReceberWhatsapp || false}
                    readOnly
                    className="cursor-not-allowed"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">Aceita WhatsApp</label>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Users;
