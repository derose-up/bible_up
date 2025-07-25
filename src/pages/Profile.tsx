// Profile.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import {
  User,
  Mail,
  Phone,
  Church,
  Users,
  Camera,
  Save,
  Crown,
  Calendar,
  X,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadToCloudinary } from '../services/cloudinary';
import { formatarData } from '../utils/date';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/Forms/Input';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useController } from 'react-hook-form';
import { motion } from 'framer-motion';


interface ProfileForm {
  nome: string;
  whatsapp: string;
  igreja: string;
  funcaoMinisterial: string;
  preferenciasConteudo: { label: string; value: string }[];
  concordaReceberEmail?: boolean;
  concordaReceberWhatsapp?: boolean;
}

const Profile = () => {
  const { userData, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState(false);
  const { control } = useForm<ProfileForm>();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


const { field } = useController({
  name: 'preferenciasConteudo',
  control,
  defaultValue: userData?.preferenciasConteudo?.map((item) => ({
    label: item,
    value: item
  })) || [],
});
 

  const opcoesPreferencias = [
  { label: 'Ensino Infantil', value: 'Ensino Infantil' },
  { label: 'Jovens e Adolescentes', value: 'Jovens e Adolescentes' },
  { label: 'Espiritualidade', value: 'Espiritualidade' },
  { label: 'Motivação Cristã', value: 'Motivação Cristã' },
  { label: 'Liderança', value: 'Liderança' },
  { label: 'Estudos Bíblicos', value: 'Estudos Bíblicos' },
  { label: 'Datas Especiais', value: 'Datas Especiais' },
  { label: 'Material para impressão', value: 'Material para impressão' }
];

const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm<ProfileForm>({
  defaultValues: {
    nome: userData?.nome || '',
    whatsapp: userData?.whatsapp || '',
    igreja: userData?.igreja || '',
    funcaoMinisterial: userData?.funcaoMinisterial || '',
    preferenciasConteudo:
      userData?.preferenciasConteudo?.map((item) => ({
        label: item,
        value: item
      })) || [],
    concordaReceberEmail: userData?.concordaReceberEmail,
    concordaReceberWhatsapp: userData?.concordaReceberWhatsapp
  }
});

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
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
    toast.success('Perfil atualizado com sucesso!');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 4000); // Esconde após 4s
  };

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    setUploadingPhoto(true); // 🌀 começa o loading da foto
    try {
      let fotoPerfil = userData?.fotoPerfil || '';

      if (photoFile) {
        const uploadResult = await uploadToCloudinary(photoFile);
        fotoPerfil = uploadResult.secure_url;
      }

      await updateUserData({
  ...data,
  preferenciasConteudo: data.preferenciasConteudo.map((item) => item.value),
  concordaReceberEmail: data.concordaReceberEmail ?? false,
  concordaReceberWhatsapp: data.concordaReceberWhatsapp ?? false,
  fotoPerfil
});

      setPhotoFile(null);
      setPhotoPreview('');
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
      setUploadingPhoto(false); // ✅ finaliza o loading da foto
    }
  };

  const handlePasswordReset = async () => {
    if (!userData?.email) {
      toast.error('Email do usuário não encontrado.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, userData.email);
      toast.success('Link de redefinição de senha enviado para seu email.');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast.error('Não foi possível enviar o link. Tente novamente.');
    } finally {
      setShowResetModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tarja superior com título e subtítulo */}
        <div className="bg-purple-600 py-5 px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <User className="text-white w-7 h-7" />
              <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
            </div>
            <p className="text-white/80 text-sm">
              Gerencie suas informações pessoais
            </p>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Usuário */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">

              {/* Foto de Perfil */}
              <div className="relative inline-block mb-4">
                {photoPreview || userData?.fotoPerfil ? (
                  <img
                    src={photoPreview || userData?.fotoPerfil}
                    alt={userData?.nome}
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-purple-200">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Spinner enquanto carrega a imagem */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                  </div>
                )}

                {photoPreview && (
                  <button
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-purple-600 dark:text-purple-600 mb-1">
                {userData?.nome}
              </h2>

              <div className="flex items-center justify-center space-x-2 mb-4">
                {userData?.status === 'premium' ? (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full font-medium">
                    Gratuito
                  </span>
                )}

                {userData?.isAdmin && (
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {userData?.email}
                </div>
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Membro desde {userData?.dataCadastro && formatarData(userData.dataCadastro)}
                </div>
              </div>

              {/* Upload de Foto */}
              <label className="mt-4 cursor-pointer inline-flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Camera className="w-4 h-4" />
                <span>Trocar foto de perfil</span>
              </label>
            </Card>

            {/* Upgrade para Premium */}
            {userData?.status === 'free' && (
              <Card className="p-6 mt-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-50 dark:to-yellow-100">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-600 mb-2">
                    Upgrade para Premium
                  </h3>
                  <p className="text-gray-600 dark:text-gray-600 text-sm mb-4">
                    Acesse conteúdo exclusivo e materiais bônus
                  </p>
                  <Link to="/upgrade">
                    <Button variant="primary" size="sm" className="w-full">
                      Assinar Agora
                    </Button>
                  </Link>
                </div>
              </Card>
              )}
          </div>

          {/* Formulário de Edição */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-600 mb-6">
                Informações Pessoais
              </h3>

             {showSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4"
                  >
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Perfil atualizado com sucesso!</span>
                  </motion.div>
                )}
   
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                          className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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

                <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferências de Conteúdo
                </label>
                <Select
                  isMulti
                  options={opcoesPreferencias}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  defaultValue={userData?.preferenciasConteudo?.map((item) => ({
                    label: item,
                    value: item
                  }))}
                  onChange={(selected) => field.onChange(selected)}
                  placeholder="Selecione o que mais te interessa"
                styles={{
                    control: (base) => ({
              ...base,
              backgroundColor: '#fff',
              borderColor: '#d1d5db',
              minHeight: '44px'
            }),
            menu: (base) => ({
        ...base,
        zIndex: 999
      })
    }}
  />
</div>

 <div className="space-y-2 mt-4">
  <label className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
    <input
      type="checkbox"
      {...register("concordaReceberEmail")}
      className="mt-1"
      defaultChecked={userData?.concordaReceberEmail}
    />
    <span>Desejo receber conteúdos e novidades por <strong>e-mail</strong></span>
  </label>

  <label className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
    <input
      type="checkbox"
      {...register("concordaReceberWhatsapp")}
      className="mt-1"
      defaultChecked={userData?.concordaReceberWhatsapp}
    />
    <span>Aceito receber mensagens no <strong>WhatsApp</strong> com materiais e avisos</span>
  </label>
</div>
               
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={loading}
                    className="w-full sm:w-auto"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </Card>

            {/* Informações da Conta */}
            <Card className="p-6 mt-6">
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-600 mb-4">
                Informações da Conta
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{userData?.email}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userData?.status === 'premium' ? 'Premium' : 'Gratuito'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Data de cadastro:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userData?.dataCadastro && formatarData(userData.dataCadastro)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Último acesso:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userData?.ultimoAcesso && formatarData(userData.ultimoAcesso)}
                  </p>
                </div>
              </div>

              {/* Botão de redefinir senha */}
              <div className="mt-6">
                <Button
                  variant="secondary"
                  icon={Lock}
                  onClick={() => setShowResetModal(true)}
                >
                  Redefinir Senha
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Redefinir Senha
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Deseja enviar um link de redefinição de senha para <strong>{userData?.email}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowResetModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handlePasswordReset}>
                Enviar Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
