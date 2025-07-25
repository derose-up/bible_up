import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Upload, X, Tag, Image, Crown, BookOpen
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary, uploadPdfToCloudinary } from '../../services/cloudinary';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import Input from '../../components/Forms/Input';
import toast from 'react-hot-toast';

type FormData = {
  titulo: string;
  categoria: 'Desenhos para Colorir' | 'Atividades para Imprimir';
  isPremium: boolean;
  tags: string;
  customFields?: { titulo: string; conteudo: string }[];
};

const AddOrEditActivity = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const editMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customFields'
  });

  useEffect(() => {
    if (editMode) {
      const fetchActivity = async () => {
        try {
          const ref = doc(db, 'atividades', id!);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setValue('titulo', data.titulo);
            setValue('categoria', data.categoria);
            setValue('isPremium', data.isPremium);
            setValue('tags', data.tags?.join(', ') || '');
            setValue('customFields', data.customFields || []);
            if (data.imageUrl) {
              setImageUrl(data.imageUrl);
              setImagePreview(data.imageUrl);
            }
            if (data.pdfUrl) {
              setPdfUrl(data.pdfUrl);
              setPdfFileName('PDF já enviado');
            }
          } else {
            toast.error('Atividade não encontrada');
            navigate('/atividades-admin');
          }
        } catch (err) {
          toast.error('Erro ao carregar atividade');
        }
      };
      fetchActivity();
    }
  }, [editMode, id, navigate, setValue]);

  const handleImageUpload = async (file: File) => {
    const upload = await uploadToCloudinary(file);
    setImageUrl(upload.secure_url);
    setImagePreview(upload.secure_url);
  };

  const handlePdfUpload = async (file: File) => {
    const upload = await uploadPdfToCloudinary(file);
    setPdfUrl(upload.secure_url);
    setPdfFileName(file.name);
  };

  const onSubmit = async (data: FormData) => {
    if (!imageUrl) {
      toast.error('Adicione uma imagem para a atividade');
      return;
    }

    const payload = {
      id: editMode ? id! : crypto.randomUUID(),
      titulo: data.titulo,
      categoria: data.categoria,
      isPremium: data.isPremium,
      nova: true,
      imageUrl,
      pdfUrl,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      customFields: data.customFields ?? [],
      favoritadoPor: [],
      createdAt: serverTimestamp()
    };

    try {
      setLoading(true);
      const ref = doc(db, 'atividades', payload.id);
      if (editMode) {
        await updateDoc(ref, payload);
        toast.success('Atividade atualizada com sucesso!');
      } else {
        await setDoc(ref, payload);
        toast.success('Atividade criada com sucesso!');
      }
      navigate('/atividades-admin');
    } catch (err) {
      toast.error('Erro ao salvar atividade');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="p-8 text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        icon={ArrowLeft}
        onClick={() => navigate('/atividades-admin')}
        className="mb-6 text-purple-600"
      >
        Voltar
      </Button>

      <h1 className="text-3xl font-bold text-purple-600 mb-6">
        {editMode ? 'Editar Atividade' : 'Nova Atividade'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-4">
          <Input
            label="Título da Atividade"
            labelClassName="text-purple-600"
            {...register('titulo', { required: 'Título é obrigatório' })}
            error={errors.titulo?.message}
          />

          <select
            {...register('categoria', { required: 'Categoria é obrigatória' })}
            className="w-full p-2 rounded border dark:bg-gray-700"
          >
            <option value="">Selecione a categoria</option>
            <option value="Desenhos para Colorir">Desenhos para Colorir</option>
            <option value="Atividades para Imprimir">Atividades para Imprimir</option>
          </select>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input type="radio" value="false" {...register('isPremium')} />
              <span className="ml-2">Gratuita</span>
            </label>
            <label className="flex items-center">
              <input type="radio" value="true" {...register('isPremium')} />
              <span className="ml-2 text-yellow-600 flex items-center">
                <Crown className="w-4 h-4 mr-1" /> Premium
              </span>
            </label>
          </div>

          <Input
            label="Tags (separadas por vírgula)"
            icon={Tag}
            labelClassName="text-purple-600"
            {...register('tags')}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <label className="block text-sm font-semibold text-purple-600">
            Imagem *
          </label>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }} />
          {imagePreview && <img src={imagePreview} className="w-full max-h-48 object-cover rounded" />}

          <label className="block text-sm font-semibold text-purple-600">
            PDF (opcional)
          </label>
          <input type="file" accept="application/pdf" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePdfUpload(file);
          }} />
          {pdfFileName && <p className="text-sm mt-2">{pdfFileName}</p>}
        </Card>

        {/* Campos personalizados */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-purple-600">Campos Personalizados</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2">
              <Input
                label="Título"
                {...register(`customFields.${index}.titulo` as const)}
              />
              <textarea
                {...register(`customFields.${index}.conteudo` as const)}
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700"
              />
              <Button variant="danger" onClick={() => remove(index)}>Remover</Button>
            </div>
          ))}
          <Button type="button" onClick={() => append({ titulo: '', conteudo: '' })}>
            + Adicionar Campo
          </Button>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/atividades-admin')}>
            Cancelar
          </Button>
          <Button type="submit" icon={Save} loading={loading}>
            {editMode ? 'Salvar Alterações' : 'Criar Atividade'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditActivity;
