import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Search, 
  Filter,
  Calendar,
  User,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Log } from '../../types';
import { formatarDataHora } from '../../utils/date';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Logs = () => {
  const { userData } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('todas');
  const [dateFilter, setDateFilter] = useState<string>('hoje');

  // Mock data para demonstração
  const mockLogs: Log[] = [
    {
      id: '1',
      acao: 'LOGIN',
      usuario: 'Maria Silva',
      usuarioId: 'user1',
      detalhes: 'Login realizado com sucesso',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      ip: '192.168.1.100'
    },
    {
      id: '2',
      acao: 'CRIAR_LICAO',
      usuario: 'João Santos',
      usuarioId: 'admin1',
      detalhes: 'Nova lição criada: "A Parábola do Bom Samaritano"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      ip: '192.168.1.101'
    },
    {
      id: '3',
      acao: 'DOWNLOAD_PDF',
      usuario: 'Ana Costa',
      usuarioId: 'user2',
      detalhes: 'Download do PDF: "Atividades de Páscoa"',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      ip: '192.168.1.102'
    },
    {
      id: '4',
      acao: 'UPGRADE_PREMIUM',
      usuario: 'Carlos Oliveira',
      usuarioId: 'user3',
      detalhes: 'Upgrade para conta premium realizado',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      ip: '192.168.1.103'
    },
    {
      id: '5',
      acao: 'EXCLUIR_USUARIO',
      usuario: 'João Santos',
      usuarioId: 'admin1',
      detalhes: 'Usuário excluído: teste@email.com',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      ip: '192.168.1.101'
    },
    {
      id: '6',
      acao: 'FAVORITAR',
      usuario: 'Fernanda Lima',
      usuarioId: 'user4',
      detalhes: 'Lição favoritada: "Noé e a Arca"',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      ip: '192.168.1.104'
    },
    {
      id: '7',
      acao: 'CRIAR_ATIVIDADE',
      usuario: 'João Santos',
      usuarioId: 'admin1',
      detalhes: 'Nova atividade criada: "Desenho de Davi e Golias"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ip: '192.168.1.101'
    },
    {
      id: '8',
      acao: 'LOGOUT',
      usuario: 'Roberto Ferreira',
      usuarioId: 'user5',
      detalhes: 'Logout realizado',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      ip: '192.168.1.105'
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.detalhes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'todas' || log.acao === actionFilter;
    
    let matchesDate = true;
    const now = new Date();
    const logDate = log.timestamp;
    
    switch (dateFilter) {
      case 'hoje':
        matchesDate = logDate.toDateString() === now.toDateString();
        break;
      case 'ontem':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = logDate.toDateString() === yesterday.toDateString();
        break;
      case 'semana':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = logDate >= weekAgo;
        break;
      case 'mes':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = logDate >= monthAgo;
        break;
    }

    return matchesSearch && matchesAction && matchesDate;
  });

  const getActionColor = (acao: string) => {
    switch (acao) {
      case 'LOGIN':
      case 'LOGOUT':
        return 'text-blue-600 bg-blue-100';
      case 'CRIAR_LICAO':
      case 'CRIAR_ATIVIDADE':
        return 'text-green-600 bg-green-100';
      case 'EXCLUIR_USUARIO':
      case 'EXCLUIR_LICAO':
        return 'text-red-600 bg-red-100';
      case 'UPGRADE_PREMIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'DOWNLOAD_PDF':
        return 'text-purple-600 bg-purple-100';
      case 'FAVORITAR':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionIcon = (acao: string) => {
    switch (acao) {
      case 'LOGIN':
      case 'LOGOUT':
        return User;
      case 'CRIAR_LICAO':
      case 'CRIAR_ATIVIDADE':
        return Activity;
      case 'DOWNLOAD_PDF':
        return Download;
      default:
        return Activity;
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLogs([...mockLogs]);
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Data/Hora', 'Ação', 'Usuário', 'Detalhes', 'IP'],
      ...filteredLogs.map(log => [
        formatarDataHora(log.timestamp),
        log.acao,
        log.usuario,
        log.detalhes,
        log.ip || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Logs do Sistema
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredLogs.length} registros encontrados
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" icon={RefreshCw} onClick={handleRefresh}>
                Atualizar
              </Button>
              <Button variant="outline" icon={Download} onClick={handleExport}>
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Buscar nos logs..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todas as ações</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="CRIAR_LICAO">Criar Lição</option>
              <option value="CRIAR_ATIVIDADE">Criar Atividade</option>
              <option value="EXCLUIR_USUARIO">Excluir Usuário</option>
              <option value="UPGRADE_PREMIUM">Upgrade Premium</option>
              <option value="DOWNLOAD_PDF">Download PDF</option>
              <option value="FAVORITAR">Favoritar</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="hoje">Hoje</option>
              <option value="ontem">Ontem</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
              <option value="todos">Todos</option>
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{logs.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total de Logs</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {logs.filter(l => l.acao === 'LOGIN').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Logins Hoje</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.acao.includes('CRIAR')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Criações</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {logs.filter(l => l.acao === 'DOWNLOAD_PDF').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
          </Card>
        </div>

        {/* Lista de Logs */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Detalhes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log, index) => {
                  const Icon = getActionIcon(log.acao);
                  
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatarDataHora(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.acao)}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {log.acao}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.usuario}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {log.usuarioId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {log.detalhes}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {log.ip || '-'}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum log encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar os filtros para ver mais resultados.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Logs;