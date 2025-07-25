import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Star, 
  MessageSquare, 
  User,
  Send,
  ThumbsUp,
  Calendar,
  Filter,
  Plus
} from 'lucide-react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Depoimento } from '../types';
import { formatarData } from '../utils/date';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/Forms/Input';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface DepoimentoForm {
  avaliacao: number;
  comentario: string;
}

const Testimonials = () => {
  const { userData } = useAuth();
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<DepoimentoForm>();

  const watchedRating = watch('avaliacao', 0);

  // Mock data para demonstração
  const mockDepoimentos: Depoimento[] = [
    {
      id: '1',
      nome: 'Maria Silva',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=100',
      avaliacao: 5,
      comentario: 'O BibleUp transformou completamente minhas aulas na EBD! Os materiais são de excelente qualidade e as crianças ficam super engajadas. Recomendo para todos os educadores cristãos!',
      aprovado: true,
      createdAt: new Date('2024-01-20')
    },
    {
      id: '2',
      nome: 'João Santos',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100',
      avaliacao: 5,
      comentario: 'Como pastor, sempre busco recursos de qualidade para nossa igreja. O BibleUp superou todas as expectativas! O conteúdo premium vale cada centavo.',
      aprovado: true,
      createdAt: new Date('2024-01-18')
    },
    {
      id: '3',
      nome: 'Ana Costa',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?w=100',
      avaliacao: 5,
      comentario: 'Sou líder de jovens há 10 anos e nunca encontrei uma plataforma tão completa. As lições são bem estruturadas e os materiais bônus são incríveis!',
      aprovado: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '4',
      nome: 'Carlos Oliveira',
      avatar: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?w=100',
      avaliacao: 4,
      comentario: 'Excelente plataforma! Uso principalmente para preparar aulas para adolescentes. Só gostaria que tivesse mais conteúdo para essa faixa etária.',
      aprovado: true,
      createdAt: new Date('2024-01-12')
    },
    {
      id: '5',
      nome: 'Fernanda Lima',
      avatar: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?w=100',
      avaliacao: 5,
      comentario: 'Como mãe e professora da EBD, o BibleUp me ajuda muito em casa e na igreja. Meus filhos adoram as atividades para colorir!',
      aprovado: true,
      createdAt: new Date('2024-01-10')
    },
    {
      id: '6',
      nome: 'Roberto Ferreira',
      avatar: 'https://images.pexels.com/photos/1181717/pexels-photo-1181717.jpeg?w=100',
      avaliacao: 5,
      comentario: 'Interface muito intuitiva e conteúdo de primeira qualidade. O suporte também é excelente. Parabéns à equipe!',
      aprovado: true,
      createdAt: new Date('2024-01-08')
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setDepoimentos(mockDepoimentos);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDepoimentos = depoimentos.filter(depoimento => {
    if (filterRating === null) return true;
    return depoimento.avaliacao === filterRating;
  });

  const averageRating = depoimentos.length > 0 
    ? depoimentos.reduce((acc, dep) => acc + dep.avaliacao, 0) / depoimentos.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: depoimentos.filter(dep => dep.avaliacao === rating).length,
    percentage: depoimentos.length > 0 
      ? (depoimentos.filter(dep => dep.avaliacao === rating).length / depoimentos.length) * 100 
      : 0
  }));

  const onSubmit = async (data: DepoimentoForm) => {
    if (!userData) {
      toast.error('Você precisa estar logado para deixar um depoimento');
      return;
    }

    setSubmitting(true);
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Depoimento enviado com sucesso! Será analisado pela nossa equipe.');
      reset();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao enviar depoimento:', error);
      toast.error('Erro ao enviar depoimento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-600">Depoimentos</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Vejam o que nossos usuários estão dizendo sobre o BibleUp
              </p>
            </div>
          </div>
          </div>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Avaliação Geral */}
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Baseado em {depoimentos.length} avaliações
            </div>
          </Card>

          {/* Distribuição de Notas */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribuição de Avaliações
            </h3>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todas as avaliações</option>
              <option value="5">5 estrelas</option>
              <option value="4">4 estrelas</option>
              <option value="3">3 estrelas</option>
              <option value="2">2 estrelas</option>
              <option value="1">1 estrela</option>
            </select>
          </div>

          {userData && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowModal(true)}
            >
              Deixar Depoimento
            </Button>
          )}
        </div>

        {/* Lista de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepoimentos.map((depoimento, index) => (
            <motion.div
              key={depoimento.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  {depoimento.avatar ? (
                    <img
                      src={depoimento.avatar}
                      alt={depoimento.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {depoimento.nome}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {renderStars(depoimento.avaliacao)}
                      <span className="text-sm text-gray-500">
                        {formatarData(depoimento.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comentário */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{depoimento.comentario}"
                </p>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Útil</span>
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDepoimentos.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum depoimento encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seja o primeiro a deixar um depoimento!
            </p>
          </div>
        )}

        {/* Modal de Novo Depoimento */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={<span className="text-purple-600">Deixar Depoimento</span>}
          size="md"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avaliação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sua avaliação
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(watchedRating, true, (rating) => setValue('avaliacao', rating))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {watchedRating > 0 ? `${watchedRating} estrela${watchedRating > 1 ? 's' : ''}` : 'Clique para avaliar'}
                </span>
              </div>
              <input
                type="hidden"
                {...register('avaliacao', {
                  required: 'Por favor, selecione uma avaliação',
                  min: { value: 1, message: 'Selecione pelo menos 1 estrela' }
                })}
              />
              {errors.avaliacao && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.avaliacao.message}
                </p>
              )}
            </div>

            {/* Comentário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu comentário
              </label>
              <textarea
                {...register('comentario', {
                  required: 'Comentário é obrigatório',
                  minLength: {
                    value: 10,
                    message: 'Comentário deve ter pelo menos 10 caracteres'
                  },
                  maxLength: {
                    value: 500,
                    message: 'Comentário deve ter no máximo 500 caracteres'
                  }
                })}
                rows={4}
                placeholder="Conte-nos sobre sua experiência com o BibleUp..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {errors.comentario && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.comentario.message}
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={Send}
                className="flex-1"
              >
                Enviar Depoimento
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Testimonials;