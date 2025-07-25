# BibleUp - Aplicativo Web para Conteúdos Bíblicos Educativos

BibleUp é um aplicativo web responsivo desenvolvido para professores, pais e líderes cristãos, oferecendo acesso a lições bíblicas, atividades educativas, materiais bônus e muito mais.

## 🌟 Características Principais

- **Interface totalmente em português (Brasil)**
- **Responsivo** - Funciona perfeitamente em celulares, tablets e desktops
- **Três tipos de usuário**: Admin, Premium e Free
- **Autenticação completa** com Firebase Auth
- **Upload de arquivos** via Cloudinary
- **Pagamentos** integrados com Mercado Pago
- **PWA** - Aplicativo instalável com funcionalidade offline
- **Tema claro/escuro**

## 🚀 Funcionalidades

### Para Usuários Free
- Acesso a lições básicas
- Atividades gratuitas para colorir e impressão
- Sistema de favoritos
- Perfil personalizável

### Para Usuários Premium
- Acesso completo a todas as lições
- Materiais bônus exclusivos
- Download de PDFs com marca d'água
- Conteúdo premium por categoria

### Para Administradores
- Dashboard completo com estatísticas
- Gestão de usuários
- Criação e edição de lições
- Upload de atividades
- Sistema de auditoria (logs)

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Firebase** (Auth, Firestore)
- **Cloudinary** para upload de arquivos
- **Mercado Pago** para pagamentos
- **React Router Dom** para roteamento
- **React Hook Form** para formulários
- **Lucide React** para ícones

## 📋 Configuração do Ambiente

1. Clone o repositório:
```bash
git clone <repository-url>
cd bibleup
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Preencha o arquivo `.env` com suas credenciais:
```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Mercado Pago
VITE_MERCADO_PAGO_PUBLIC_KEY=your_mercado_pago_public_key
```

5. Execute o projeto:
```bash
npm run dev
```

## 🎨 Sistema de Cores por Categoria

- **Kids**: `#8ce205` (Verde claro)
- **Juniores**: `#72008c` (Roxo)
- **Adolescentes**: `#f20384` (Rosa)
- **Jovens**: `#1da2c3` (Azul)
- **Datas Festivas**: `#01b58e` (Verde água)
- **Outros Temas**: `#ffd400` (Amarelo)
- **Atividades para Imprimir**: `#f76400` (Laranja)
- **Desenhos para Colorir**: `#ee1e2e` (Vermelho)

**Cor primária do app**: `#72008c`

## 📱 Estrutura de Rotas

### Públicas
- `/login` - Página de login
- `/cadastro` - Cadastro de usuários
- `/recuperar-senha` - Recuperação de senha

### Autenticadas
- `/home` - Página inicial com cards por categoria
- `/licoes/:categoria` - Lista de lições filtradas
- `/licao/:id` - Detalhes da lição
- `/atividades/:categoria` - Galeria de atividades
- `/favoritos` - Conteúdos favoritados
- `/perfil` - Dados do usuário
- `/upgrade` - Página de assinatura premium
- `/bonus` - Materiais bônus (premium/admin)
- `/depoimentos` - Avaliações e comentários

### Administrativas
- `/dashboard` - Painel administrativo
- `/usuarios` - Gestão de usuários
- `/licoes-admin` - Gestão de lições
- `/adicionar-licao` - Criação de lições
- `/editar-licao/:id` - Edição de lições
- `/atividades-admin` - Gestão de atividades
- `/logs` - Auditoria do sistema

## 🗃️ Estrutura do Banco de Dados (Firestore)

### Coleção: `usuarios`
```typescript
{
  nome: string;
  email: string;
  whatsapp: string;
  igreja: string;
  funcaoMinisterial: string;
  status: 'free' | 'premium';
  isAdmin: boolean;
  fotoPerfil?: string;
  dataCadastro: Timestamp;
  ultimoAcesso: Timestamp;
  atualizadoEm: Timestamp;
  favoritadoPor?: string[];
}
```

### Coleção: `licoes`
```typescript
{
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
  favoritadoPor: string[];
  createdAt: Timestamp;
}
```

### Coleção: `atividades`
```typescript
{
  titulo: string;
  categoria: 'Desenhos para Colorir' | 'Atividades para Imprimir';
  isPremium: boolean;
  nova: boolean;
  imageUrl: string;
  pdfUrl?: string;
  tags: string[];
  favoritadoPor: string[];
  createdAt: Timestamp;
}
```

## 🏗️ Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout/         # Componentes de layout
│   ├── UI/            # Componentes de interface
│   └── Forms/         # Componentes de formulário
├── contexts/           # Contextos React
├── hooks/             # Hooks customizados
├── pages/             # Páginas da aplicação
│   ├── auth/          # Páginas de autenticação
│   ├── admin/         # Páginas administrativas
│   └── ...
├── services/          # Integrações externas
├── types/             # Definições TypeScript
└── utils/             # Funções utilitárias
```

## 🚀 Build e Deploy

Para build de produção:
```bash
npm run build
```

Para preview da build:
```bash
npm run preview
```

## 📄 Licença

Este projeto é propriedade privada. Todos os direitos reservados.

## 👥 Contribuição

Este é um projeto privado. Para contribuições, entre em contato com a equipe de desenvolvimento.