import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen, Save, ArrowLeft, Upload, X, Crown, Tag, Image
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary, uploadPdfToCloudinary } from '../../services/cloudinary';
import { db } from '../../services/firebase';
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { Licao } from '../../types';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/Forms/Input';
import toast from 'react-hot-toast';

type FormData = Omit<Licao, 'id' | 'favoritadoPor' | 'createdAt'> & {
  tags: string;
};

const AddOrEditLesson = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const editMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

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
      const fetchLesson = async () => {
        try {
          const docRef = doc(db, 'licoes', id!);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Licao;
            Object.entries(data).forEach(([key, value]) => {
              if (key === 'tags') {
                setValue('tags', value.join(', '));
              } else if (key === 'desenhoUrl') {
                setImageUrl(value as string);
                setImagePreview(value as string);
              } else if (key === 'pdfUrl') {
                setPdfUrl(value as string);
                setPdfFileName('PDF já enviado');
              } else {
                setValue(key as keyof FormData, value);
              }
            });
          } else {
            toast.error('Lição não encontrada');
            navigate('/licoes-admin');
          }
        } catch (error) {
          console.error(error);
          toast.error('Erro ao carregar lição');
        }
      };
      fetchLesson();
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
      toast.error('Adicione uma imagem para a lição');
      return;
    }

    const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);

    const payload: Licao = {
      id: editMode ? id! : crypto.randomUUID(),
      titulo: data.titulo,
      categoria: data.categoria,
      isPremium: data.isPremium,
      nova: true,
      historia: data.historia,
      aplicacao: data.aplicacao,
      dinamica: data.dinamica,
      atividade: data.atividade,
      oracao: data.oracao,
      desenhoUrl: imageUrl,
      pdfUrl,
      tags,
      customFields: data.customFields ?? [],
      favoritadoPor: [],
      createdAt: serverTimestamp()
    };

    try {
      setLoading(true);
      const ref = doc(db, 'licoes', payload.id);
      if (editMode) {
        await updateDoc(ref, payload);
        toast.success('Lição atualizada com sucesso!');
      } else {
        await setDoc(ref, payload);
        toast.success('Lição criada com sucesso!');
      }
      navigate('/licoes-admin');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar lição');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        icon={ArrowLeft}
        onClick={() => navigate('/licoes-admin')}
        className="mb-6 text-purple-600 dark:text-purple-600"
      >
        Voltar
      </Button>

      <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-600 mb-6">
        {editMode ? 'Editar Lição' : 'Nova Lição'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-4">
          <Input
            label="Título da Lição"
            labelClassName="text-purple-600"
            {...register('titulo', { required: 'Título é obrigatório' })}
            error={errors.titulo?.message}
          />

          <select
            {...register('categoria', { required: 'Categoria é obrigatória' })}
            className="w-full p-2 rounded border dark:bg-gray-700"
          >
            <option value="">Selecione a categoria</option>
            <option value="Kids">Kids</option>
            <option value="Juniores">Juniores</option>
            <option value="Adolescentes">Adolescentes</option>
            <option value="Jovens">Jovens</option>
            <option value="Datas Festivas">Datas Festivas</option>
            <option value="Outros Temas">Outros Temas</option>
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

        {/* Uploads */}
        <Card className="p-6 space-y-4">
          <label className="block text-sm font-semibold text-purple-600 dark:text-purple-600">
            Imagem da Lição *
          </label>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }} />
          {imagePreview && (
            <img src={imagePreview} className="w-full max-h-48 object-cover rounded" />
                  )}
            </Card>

          <label className="block text-sm font-semibold text-purple-600 dark:text-purple-600">
            PDF da Lição (opcional)
          </label>
          <input type="file" accept="application/pdf" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePdfUpload(file);
          }} />
          {pdfFileName && <p className="text-sm mt-2">{pdfFileName}</p>}
        </Card>

        {/* Campos principais */}
        <Card className="p-6 space-y-4">
          {['historia', 'aplicacao', 'dinamica', 'atividade', 'oracao'].map((campo) => (
            <div key={campo}>
              <label className="block font-medium capitalize text-sm mb-1 text-purple-600 dark:text-purple-600">
                {campo.charAt(0).toUpperCase() + campo.slice(1)}
              </label>
              <textarea
                {...register(campo as keyof FormData)}
                rows={4}
                className="w-full p-2 border rounded dark:bg-gray-700"
              />
            </div>
           ))}
        </Card>

        {/* Campos customizados */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-600">Campos Personalizados</h2>
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

        {/* Ações */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/licoes-admin')}>
            Cancelar
          </Button>
          <Button type="submit" icon={Save} loading={loading}>
            {editMode ? 'Salvar Alterações' : 'Criar Lição'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditLesson;