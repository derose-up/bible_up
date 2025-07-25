import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  PaintBucket, 
  Crown,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Star,
  Activity,
  DollarSign,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatarData } from '../../utils/date';

interface DashboardStats {
  totalUsuarios: number;
  usuariosPremium: number;
  totalLicoes: number;
  totalAtividades: number;
  downloadsHoje: number;
  receitaMensal: number;
  novosUsuariosHoje: number;
  avaliacaoMedia: number;
}

interface RecentActivity {
  id: string;
  tipo: 'usuario' | 'licao' | 'atividade' | 'download';
  descricao: string;
  timestamp: Date;
  usuario?: string;
}

const Dashboard = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data para demonstração
  const mockStats: DashboardStats = {
    totalUsuarios: 2547,
    usuariosPremium: 892,
    totalLicoes: 156,
    totalAtividades: 324,
    downloadsHoje: 1247,
    receitaMensal: 17748.50,
    novosUsuariosHoje: 23,
    avaliacaoMedia: 4.8
  };

  const mockActivities: RecentActivity[] = [
    {
      id: '1',
      tipo: 'usuario',
      descricao: 'Novo usuário cadastrado: Maria Silva',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      usuario: 'Maria Silva'
    },
    {
      id: '2',
      tipo: 'licao',
      descricao: 'Nova lição publicada: "A Parábola do Bom Samaritano"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '3',
      tipo: 'download',
      descricao: 'PDF baixado: "Atividades de Páscoa"',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      usuario: 'João Santos'
    },
    {
      id: '4',
      tipo: 'usuario',
      descricao: 'Upgrade para Premium: Ana Costa',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      usuario: 'Ana Costa'
    },
    {
      id: '5',
      tipo: 'atividade',
      descricao: 'Nova atividade adicionada: "Desenho de Noé"',
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setStats(mockStats);
      setRecentActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'usuario': return UserPlus;
      case 'licao': return BookOpen;
      case 'atividade': return PaintBucket;
      case 'download': return Download;
      default: return Activity;
    }
  };

  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'usuario': return 'text-green-600 bg-green-100';
      case 'licao': return 'text-blue-600 bg-blue-100';
      case 'atividade': return 'text-orange-600 bg-orange-100';
      case 'download': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Header + Botões de Ação */}
<div className="mb-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        Dashboard Administrativo
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Visão geral do sistema BibleUp
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex gap-2">
      <Button variant="primary" onClick={() => window.location.href = '/licoes-admin'}>
        <BookOpen className="w-4 h-4 mr-2" />
        Gerenciar Lições
      </Button>
      <Button variant="outline" onClick={() => window.location.href = '/atividades-admin'}>
        <PaintBucket className="w-4 h-4 mr-2" />
        Gerenciar Atividades
      </Button>
      <Button variant="outline" onClick={() => window.location.href = '/usuarios'}>
        <Users className="w-4 h-4 mr-2" />
        Gerenciar Usuários
      </Button>
      <Button variant="outline" onClick={() => window.location.href = '/logs'}>
        <Activity className="w-4 h-4 mr-2" />
        Ver Logs
      </Button>
    </div>
  </div>
</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total de Usuários
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalUsuarios.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    +{stats?.novosUsuariosHoje} hoje
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Usuários Premium
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.usuariosPremium.toLocaleString()}
                  </p>
                  <p className="text-sm text-yellow-600">
                    {stats && ((stats.usuariosPremium / stats.totalUsuarios) * 100).toFixed(1)}% do total
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Receita Mensal
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ {stats?.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-green-600">
                    +12.5% vs mês anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Downloads Hoje
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.downloadsHoje.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">
                    +8.2% vs ontem
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conteúdo
              </h3>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Lições</span>
                <span className="font-semibold">{stats?.totalLicoes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Atividades</span>
                <span className="font-semibold">{stats?.totalAtividades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-semibold">{(stats?.totalLicoes || 0) + (stats?.totalAtividades || 0)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Avaliação
              </h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats?.avaliacaoMedia}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(stats?.avaliacaoMedia || 0)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Baseado em 1,247 avaliações
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Crescimento
              </h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Usuários</span>
                <span className="font-semibold text-green-600">+15.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Premium</span>
                <span className="font-semibold text-green-600">+23.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Receita</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividades Recentes
            </h3>
            <Button variant="outline" size="sm" icon={Eye}>
              Ver Todas
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.tipo);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.tipo)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {activity.descricao}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatarData(activity.timestamp)} às {activity.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;