import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Atividade } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatarData } from '../utils/date';
import { Crown, Heart, ArrowLeft } from 'lucide-react';
import Button from '../components/UI/Button';

// Cores por categoria
const CATEGORIA_CORES: Record<string, string> = {
  'Desenhos para Colorir': '#EE1E2E',  // vermelho
  'Atividades para Imprimir': '#F76400',  // laranja
};

const AtividadePublica = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarAtividade = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'atividades', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAtividade({
            id: docSnap.id,
            titulo: data.titulo,
            categoria: data.categoria,
            isPremium: data.isPremium,
            nova: data.nova,
            imageUrl: data.imageUrl,
            pdfUrl: data.pdfUrl,
            tags: data.tags || [],
            favoritadoPor: data.favoritadoPor || [],
            createdAt: data.createdAt?.toDate?.() || new Date(),
          });
        } else {
          setAtividade(null);
        }
      } catch (error) {
        console.error('Erro ao buscar atividade:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarAtividade();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!atividade) {
    return <div className="text-center py-12">Atividade não encontrada</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="text-purple-600 border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <img
        src={atividade.imageUrl}
        alt={atividade.titulo}
        className="w-full max-h-[500px] object-contain rounded mb-6 border dark:border-gray-700"
      />

      <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">{atividade.titulo}</h1>

      <div className="text-sm mb-4 flex flex-wrap gap-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: (CATEGORIA_CORES[atividade.categoria] || '#D1D5DB') + '20',
            color: CATEGORIA_CORES[atividade.categoria] || '#374151',
          }}
        >
          {atividade.categoria}
        </span>

        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          {atividade.isPremium && <Crown className="w-4 h-4" />}
          {atividade.isPremium ? 'Premium' : 'Gratuita'}
        </span>

        <span className="text-gray-600 dark:text-gray-400">
          Criada em: {formatarData(atividade.createdAt)}
        </span>

        <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
          <Heart className="w-4 h-4" />
          {atividade.favoritadoPor?.length ?? 0} favorito(s)
        </span>
      </div>

      {atividade.tags?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {atividade.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <a
        href={atividade.pdfUrl || atividade.imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
      >
        Baixar
      </a>
    </div>
  );
};

export default AtividadePublica;
