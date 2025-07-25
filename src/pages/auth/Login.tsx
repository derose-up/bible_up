import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Forms/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
  lembrarMe: boolean;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
  register,
  handleSubmit,
  formState: { errors },
  setValue,
} = useForm<LoginForm>();

// Set valor inicial do checkbox com base no localStorage
useEffect(() => {
  const emailSalvo = localStorage.getItem('email');
  if (emailSalvo) {
    setValue('email', emailSalvo);
    setValue('lembrarMe', true);
  }
}, [setValue]);

  const onSubmit = async (data: LoginForm) => {
  setLoading(true);
  setLoginError(null); // limpa erros anteriores
  try {
    await login(data.email, data.password);
    toast.success('Login realizado com sucesso!');

    if (data.lembrarMe) {
      localStorage.setItem('email', data.email);
    } else {
      localStorage.removeItem('email');
    }

    setTimeout(() => navigate('/home'), 800);
  } catch (error) {
    console.error('Erro no login:', error);
    setLoginError('Email ou senha inválidos.');
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
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo BibleUp" className="h-36 w-auto" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-white">
              Entrar no BibleUp
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Mensagem de erro de login */}
          {loginError && (
            <div
              className="mb-4 text-red-600 text-sm text-center"
              aria-live="polite"
              role="alert"
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              type="email"
              autoComplete="email"
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

            <Input
              type="password"
              autoComplete="current-password"
              label="Senha"
              icon={Lock}
              placeholder="Sua senha"
              showPasswordToggle
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres'
                }
              })}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600"
                  {...register('lembrarMe')}
                />
                Lembrar-me
              </label>
              <Link
                to="/recuperar-senha"
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <Link
                to="/cadastro"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium hover:underline"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
