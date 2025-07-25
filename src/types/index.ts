export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  whatsapp: string;
  igreja: string;
  funcaoMinisterial: string;
  status: 'free' | 'premium';
  isAdmin: boolean;
  fotoPerfil: string;
  dataCadastro: Date;
  ultimoAcesso: Date;
  atualizadoEm: Date;
  updatedAt: Date;
  favoritadoPor: string[];

  concordaReceberEmail?: boolean;
  concordaReceberWhatsapp?: boolean;
  tagsMarketing?: string[];
  preferenciasConteudo?: string[];
  campanhaOrigem?: string;
}

export interface Licao {
  id: string;
  titulo: string;
  categoria: 'Kids' | 'Juniores' | 'Adolescentes' | 'Jovens' | 'Datas Festivas' | 'Outros Temas';
  isPremium: boolean;
  nova: boolean;
  historia: string;
  aplicacao: string;
  dinamica: string;
  atividade: string;
  oracao: string;
  desenhoUrl: string;
  pdfUrl?: string;
  tags: string[];
  customFields?: Record<string, unknown>[];
  favoritadoPor: string[];
  createdAt: Date;
}

export interface Atividade {
  id: string;
  titulo: string;
  categoria: 'Desenhos para Colorir' | 'Atividades para Imprimir';
  isPremium: boolean;
  nova: boolean;
  imageUrl: string;
  pdfUrl?: string;
  tags: string[];
  favoritadoPor: string[];
  createdAt: Date;
}

export interface Log {
  id: string;
  acao: string;
  usuario: string;
  usuarioId: string;
  detalhes: string;
  timestamp: Date;
  ip?: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  avatar?: string;
  avaliacao: number;
  comentario: string;
  aprovado: boolean;
  createdAt: Date;
}

export type Categoria =
  | 'Kids'
  | 'Juniores'
  | 'Adolescentes'
  | 'Jovens'
  | 'Datas Festivas'
  | 'Outros Temas';

export const categoriaLabels: Partial<Record<Categoria | CategoriaAtividade, string>> = {
  Kids: "Kids",
  Juniores: "Juniores",
  Adolescentes: "Adolescentes",
  Jovens: "Jovens",
  "Datas Festivas": "Datas Festivas",
  "Outros Temas": "Outros Temas",
  "Atividades para Imprimir": "Atividades para Imprimir",
  "Desenhos para Colorir": "Desenhos para Colorir"
};

export type CategoriaAtividade = 'Desenhos para Colorir' | 'Atividades para Imprimir';

export const CATEGORIA_CORES: Record<Categoria | CategoriaAtividade, string> = {
  'Kids': '#8ce205',
  'Juniores': '#72008c',
  'Adolescentes': '#f20384',
  'Jovens': '#1da2c3',
  'Datas Festivas': '#01b58e',
  'Outros Temas': '#ffd400',
  'Atividades para Imprimir': '#f76400',
  'Desenhos para Colorir': '#ee1e2e'
};