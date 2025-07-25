import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  X, 
  Star,
  Download,
  BookOpen,
  PaintBucket,
  Heart,
  Shield,
  Zap,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Upgrade = () => {
  const { userData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = {
    free: [
      'Acesso a lições básicas',
      'Atividades gratuitas',
      'Sistema de favoritos',
      'Perfil personalizável'
    ],
    premium: [
      'Acesso completo a todas as lições',
      'Materiais bônus exclusivos',
      'Download de PDFs',
      'Conteúdo premium por categoria',
      'Suporte prioritário',
      'Novos conteúdos em primeira mão',
      'Sem anúncios',
      'Backup na nuvem'
    ]
  };

  const plans = {
    monthly: {
      price: 'R$ 19,90',
      period: '/mês',
      total: 'R$ 19,90 por mês'
    },
    yearly: {
      price: 'R$ 159,90',
      period: '/ano',
      total: 'R$ 13,33 por mês',
      discount: '33% de desconto'
    }
  };

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Professora EBD',
      comment: 'O BibleUp transformou minhas aulas! Os materiais são incríveis e as crianças adoram.',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Pastor',
      comment: 'Conteúdo de qualidade excepcional. Recomendo para todos os educadores cristãos.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Líder de Jovens',
      comment: 'Os materiais premium são fantásticos. Vale cada centavo investido!',
      rating: 5
    }
  ];

  const handleSubscribe = () => {
    // TODO: Integrar com Mercado Pago
    console.log('Iniciando processo de assinatura:', selectedPlan);
  };

  if (userData?.status === 'premium') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Você já é Premium!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Aproveite todos os benefícios da sua assinatura premium.
          </p>
          <Button onClick={() => window.history.back()}>
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Upgrade para Premium
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Desbloqueie todo o potencial do BibleUp com acesso completo a lições exclusivas, 
              materiais bônus e muito mais!
            </p>
          </motion.div>
        </div>

        {/* Comparação de Planos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Plano Gratuito */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 h-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plano Gratuito
                </h3>
                <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  R$ 0
                  <span className="text-lg font-normal">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full" disabled>
                Plano Atual
              </Button>
            </Card>
          </motion.div>

          {/* Plano Premium */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 h-full border-2 border-yellow-500 relative overflow-hidden">
              {/* Badge Popular */}
              <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 text-sm font-medium">
                Mais Popular
              </div>

              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Plano Premium
                  </h3>
                </div>
                
                {/* Toggle de Preços */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedPlan === 'monthly'
                        ? 'bg-yellow-500 text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Mensal
                  </button>
                  <button
                    onClick={() => setSelectedPlan('yearly')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedPlan === 'yearly'
                        ? 'bg-yellow-500 text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Anual
                  </button>
                </div>

                <div className="text-3xl font-bold text-yellow-600">
                  {plans[selectedPlan].price}
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                    {plans[selectedPlan].period}
                  </span>
                </div>
                
                {selectedPlan === 'yearly' && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    {plans[selectedPlan].discount} • {plans[selectedPlan].total}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant="primary" 
                className="w-full bg-yellow-500 hover:bg-yellow-600"
                onClick={handleSubscribe}
                icon={CreditCard}
              >
                Assinar Agora
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Benefícios Premium */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Por que escolher o Premium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Conteúdo Exclusivo',
                description: 'Acesso a todas as lições premium e materiais especiais'
              },
              {
                icon: Download,
                title: 'Downloads Ilimitados',
                description: 'Baixe PDFs de alta qualidade de todas as lições'
              },
              {
                icon: Zap,
                title: 'Novidades em Primeira Mão',
                description: 'Seja o primeiro a acessar novos conteúdos'
              },
              {
                icon: Shield,
                title: 'Suporte Prioritário',
                description: 'Atendimento exclusivo e suporte técnico premium'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center h-full">
                  <benefit.icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Depoimentos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            O que nossos usuários dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Posso cancelar a qualquer momento?',
                answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.'
              },
              {
                question: 'O que acontece se eu cancelar?',
                answer: 'Você continuará tendo acesso premium até o final do período pago, depois retornará ao plano gratuito.'
              },
              {
                question: 'Posso fazer upgrade do plano mensal para anual?',
                answer: 'Sim! Você pode alterar seu plano a qualquer momento na área do seu perfil.'
              },
              {
                question: 'Os materiais ficam salvos se eu cancelar?',
                answer: 'Seus favoritos e dados pessoais são mantidos, mas o acesso aos conteúdos premium será restrito.'
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de educadores que já transformaram suas aulas com o BibleUp Premium.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={handleSubscribe}
              icon={Crown}
            >
              Assinar Premium Agora
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;