import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import {
  Mail,
  Lock,
  User,
  Phone,
  Church,
  Users,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary } from '../../services/cloudinary';
import Input from '../../components/Forms/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import toast from 'react-hot-toast';

interface RegisterForm {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  whatsapp: string;
  igreja: string;
  funcaoMinisterial: string;
  concordaReceberEmail?: boolean;
  concordaReceberWhatsapp?: boolean;
  tagsMarketing?: string[];
  preferenciasConteudo?: string[];
  campanhaOrigem?: string;
}

const opcoesPreferencias = [
  { label: 'Ensino Infantil', value: 'Ensino Infantil' },
  { label: 'Jovens e Adolescentes', value: 'Jovens e Adolescentes' },
  { label: 'Espiritualidade', value: 'Espiritualidade' },
  { label: 'Motivação Cristã', value: 'Motivação Cristã' },
  { label: 'Estudos Bíblicos', value: 'Estudos Bíblicos' },
  { label: 'Liderança', value: 'Liderança' },
  { label: 'Datas Especiais', value: 'Datas Especiais' },
  { label: 'Material para impressão', value: 'Material para impressão' }
];

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [campanhaOrigem, setCampanhaOrigem] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegisterForm>();

  const password = watch('password');

 useEffect(() => {
    // Pega a campanha da URL utm_campaign, se existir
    const urlParams = new URLSearchParams(window.location.search);
    const campanha = urlParams.get('utm_campaign') || 'orgânico';
    setCampanhaOrigem(campanha);
  }, []);

  // Adicionar UI para preferenciasConteudo (checkboxes)
  // Essa função controla a seleção das preferências
  const preferenciasSelecionadas = watch('preferenciasConteudo') || [];

  const togglePreferencia = (valor: string) => {
    const atual = preferenciasSelecionadas as string[];
    if (atual.includes(valor)) {
      setValue(
        'preferenciasConteudo',
        atual.filter((v) => v !== valor),
        { shouldValidate: true }
      );
    } else {
      setValue(
        'preferenciasConteudo',
        [...atual, valor],
        { shouldValidate: true }
      );
    }
  }; 

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Selecione uma imagem válida');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo deve ter no máximo 5MB');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      let fotoPerfil = '';

      if (photoFile) {
        const uploadResult = await uploadToCloudinary(photoFile);
        fotoPerfil = uploadResult.secure_url;
      }

      await registerUser({
        nome: data.nome,
        email: data.email,
        password: data.password,
        whatsapp: data.whatsapp,
        igreja: data.igreja,
        funcaoMinisterial: data.funcaoMinisterial,
        fotoPerfil,
        concordaReceberEmail: data.concordaReceberEmail ?? false,
        concordaReceberWhatsapp: data.concordaReceberWhatsapp ?? false,
        tagsMarketing: [], // Será montado no contexto com funcaoMinisterial + preferenciasConteudo
        preferenciasConteudo: data.preferenciasConteudo ?? [],
        campanhaOrigem,  // Vem da URL via useEffect
      });

      toast.success('Cadastro realizado com sucesso!');
      navigate('/home');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao criar conta. Tente novamente.');
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
          {/* Logo centralizada */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="BibleUp" className="h-24" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Cadastre-se no BibleUp
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Junte-se à nossa comunidade
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center space-y-3">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700">
                  <Upload className="w-4 h-4" />
                  <span>Adicionar foto</span>
                </div>
              </label>
            </div>

            <Input
              type="text"
              label="Nome completo"
              icon={User}
              placeholder="Seu nome completo"
              {...register('nome', {
                required: 'Nome é obrigatório',
                minLength: {
                  value: 2,
                  message: 'Nome deve ter pelo menos 2 caracteres'
                }
              })}
              error={errors.nome?.message}
            />

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

            {/* WhatsApp com máscara */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <InputMask
                  mask="(99) 99999-9999"
                  {...register('whatsapp', {
                    required: 'WhatsApp é obrigatório'
                  })}
                >
                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (

                    <input
                      {...inputProps}
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  )}
                </InputMask>
              </div>
              {errors.whatsapp && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.whatsapp.message}</p>
              )}
            </div>

            <Input
              type="text"
              label="Igreja"
              icon={Church}
              placeholder="Nome da sua igreja"
              {...register('igreja', {
                required: 'Igreja é obrigatória'
              })}
              error={errors.igreja?.message}
            />

            <Input
              type="text"
              label="Função ministerial"
              icon={Users}
              placeholder="Ex: Professor, Pastor, Líder"
              {...register('funcaoMinisterial', {
                required: 'Função ministerial é obrigatória'
              })}
              error={errors.funcaoMinisterial?.message}
            />

            {/* Preferências de Conteúdo */}
<div>
  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
    Preferências de Conteúdo
  </label>
  <div className="flex flex-wrap gap-3">
    {opcoesPreferencias.map((pref) => (
      <label
        key={pref.value}
        className="inline-flex items-center space-x-2 cursor-pointer text-gray-800 dark:text-gray-200"
      >
        <input
          type="checkbox"
          value={pref.value}
          {...register('preferenciasConteudo')}
          checked={preferenciasSelecionadas.includes(pref.value)}
          onChange={() => togglePreferencia(pref.value)}
          className="form-checkbox h-5 w-5 text-purple-600"
        />
        <span>{pref.label}</span>
      </label>
    ))}
  </div>
</div>
            
            <Input
              type="password"
              label="Senha"
              icon={Lock}
              placeholder="Mínimo 6 caracteres"
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

           <Input
              type="password"
              label="Confirmar senha"
              icon={Lock}
              placeholder="Confirme sua senha"
              showPasswordToggle
              {...register('confirmPassword', {
                required: 'Confirmação de senha é obrigatória',
                validate: value =>
                  value === password || 'Senhas não coincidem'
              })}
              error={errors.confirmPassword?.message}
            />

            <div className="space-y-2 mt-2">
            <label className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register("concordaReceberEmail")}
                className="mt-1"
              />
              <span>Desejo receber conteúdos e novidades por <strong>e-mail</strong></span>
            </label>
          
            <label className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register("concordaReceberWhatsapp")}
                className="mt-1"
              />
              <span>Aceito receber mensagens no <strong>WhatsApp</strong> com materiais e avisos</span>
            </label>
          </div>

            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Criar conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium hover:underline"
              >
                Entre aqui
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;