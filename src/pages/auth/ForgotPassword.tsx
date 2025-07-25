import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Forms/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import toast from 'react-hot-toast';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar email. Verifique o endereço e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-24 mx-auto mb-6"
          />

          {!emailSent ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-purple-600 dark:text-white">
                  Recuperar senha
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Digite seu email para receber as instruções
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  type="email"
                  label="Email"
                  icon={Mail}
                  placeholder="seu@email.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido'
                    }
                  })}
                  error={errors.email?.message}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Enviar instruções
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-purple-600 dark:text-white mb-2">
                Email enviado!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>

              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Voltar ao login
              </Button>
            </div>
          )}

          {!emailSent && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar ao login
              </Link>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
