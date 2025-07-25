📖 Bible Up - Design System
Este documento define o padrão visual, componentes reutilizáveis e boas práticas para o projeto Bible Up.

✅ 1. Paleta de Cores
| Elemento        | Cor Claro        | Cor Escuro |
| --------------- | ---------------- | ---------- |
| Primária        | `#9333ea` (roxo) | `#a855f7`  |
| Secundária      | `#f472b6` (rosa) | `#ec4899`  |
| Fundo Claro     | `#f9fafb`        | —          |
| Fundo Escuro    | —                | `#111827`  |
| Texto Principal | `#1f2937`        | `#f9fafb`  |

Classes Tailwind
- Primário: bg-purple-600 text-white
- Hover: hover:bg-purple-700
- Dark mode: dark:bg-gray-800 dark:text-white

✅ 2. Tipografia
Fonte principal: Inter ou sans-serif

Hierarquia:
Título H1: text-3xl font-bold
Subtítulo: text-lg font-semibold
Texto normal: text-sm text-gray-600 dark:text-gray-400

✅ 3. Componentes Reutilizáveis
3.1 Tarja Superior (Header padrão)

<div className="bg-purple-600 py-6 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div className="flex items-center gap-3 mb-1">
        <BookOpen className="text-white w-7 h-7" />
        <h1 className="text-3xl font-bold text-white">Lições</h1>
      </div>
      <p className="text-white/80 text-sm">
        Mostrando 10 de 50 lições
      </p>
    </div>
  </div>
</div>

3.2 Badge Padrão

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span
    style={{ backgroundColor: color + '20', color }}
    className="inline-block px-2 py-1 rounded-full text-xs font-semibold"
  >
    {children}
  </span>
);

3.3 Ribbon Badge (Diagonal, Corner, Straight)

<RibbonBadge text="Visto" type="diagonal" color="pink" icon />

📌 Tipos suportados: diagonal, corner, straight
📌 Cores: green, pink, purple etc.

3.4 Card Padrão

<article className="relative rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden flex flex-col">
  <img src="..." alt="Imagem" className="h-48 w-full object-cover" />
  <div className="p-4">
    <h2 className="text-lg font-semibold text-purple-700 mb-2">Título</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">Resumo...</p>
  </div>
</article>

3.5 Botão Favoritar

Componente: <FavoriteButton />

Deve impedir propagação do clique no card
Mostra coração cheio ou vazio

✅ 4. Layout Base das Páginas
Topo: Tarja roxa + título + contador

Filtros: Abaixo do topo, botões responsivos
Conteúdo: Grid responsivo (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
Scroll Top: Botão fixo no canto inferior direito
Loading Bar: react-top-loading-bar no topo ao carregar

✅ 5. Badges e Selos

Novo: Badge animada New🚀
Premium: <FaCrown /> Premium com animação scale
Visto: Ribbon diagonal pink com ícone de check

✅ 6. Boas Práticas
✔ Responsividade: Sempre usar sm:, lg: breakpoints
✔ Acessibilidade: aria-label nos botões e ícones
✔ Dark Mode: Garantir contraste usando dark: classes
✔ Performance: Paginação com startAfter no Firebase + lazy load imagens
✔ Feedback Visual: toast para avisos (sucesso, erro, info)

✅ 7. Animações Padrão

Entrada de cards: framer-motion → initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
Badge New: animate-pulse
Favoritar: Animação rápida no clique (whileTap={{ scale: 0.9 }})

✅ 8. Estrutura para Reuso
Sugestão de pastas para padronização:

src/
  components/
    UI/
      RibbonBadge.tsx
      FavoriteButton.tsx
      Badge.tsx
    Layout/
      Header.tsx
      Filters.tsx
      ScrollTop.tsx




