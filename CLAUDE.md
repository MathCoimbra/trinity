# Trinity Hookah — loja

Loja online da Trinity Hookah (tabacaria/narguilé), substituindo o cardápio da Ola Click (https://trinity-hookah.ola.click/products). Público majoritariamente mobile.

## Stack e comandos

- Next.js (App Router) + TypeScript + Tailwind CSS, Zustand para o carrinho, Vitest para testes.
- `npm run dev` · `npm run build` · `npm run lint` · `npm test`
- Deploy na Vercel (push na `main` = produção; branches geram previews).
- URL absoluta do site (canonical, Open Graph, sitemap) vem de `src/lib/site-url.ts`: `NEXT_PUBLIC_SITE_URL` se definida, senão `VERCEL_PROJECT_PRODUCTION_URL` (automática na Vercel). Ao ligar o domínio próprio, definir `NEXT_PUBLIC_SITE_URL` na Vercel.

## Arquitetura

Organização por feature em `src/features/*` (loader, catalog, cart, checkout), UI genérica em `src/components/ui`, utilitários em `src/lib`.

- Componentes nunca importam `src/data/*.json` diretamente: dados do catálogo passam por `src/lib/catalog/repository.ts`, para que a fonte (JSON hoje, banco no futuro) possa mudar sem tocar na UI.
- Regras de negócio (totais, descontos, mensagem do WhatsApp) ficam em funções puras, sem React, com teste unitário.
- Configurações da loja (WhatsApp do dono, endereço, pedido mínimo, taxa de entrega, redes sociais) vivem em `src/data/store.json`; nada disso hardcoded em componente.

## Pedidos

Sem pagamento online por enquanto. O checkout monta uma mensagem com o pedido e abre o WhatsApp do dono (`wa.me`). Não integrar gateway de pagamento sem pedido explícito.

## Design

- Mistura do cardápio da Ola Click (estrutura: abas de categoria sticky, cards com foto/preço/desconto) com a identidade da FIAP (fundo preto, títulos condensados em caixa alta, linhas finas, acento laranja da marca).
- Mobile-first: validar em 375px antes de desktop; alvos de toque ≥ 44px; respeitar `safe-area-inset`.
- Cores só via tokens em `src/app/globals.css` (acento laranja `--accent: #ff7a00`, padrão da marca vindo da Ola Click; texto sobre o acento usa `--accent-fg`); não usar hex solto nos componentes.
- Animações respeitam `prefers-reduced-motion`.
- O letreiro "TRINITY" da marca é a máscara `public/images/trinity-wordmark.png` (extraída do logo original), usada via `TrinityWordmark`/`wordmarkMaskStyle` em `components/ui/TrinityLogo.tsx`; nunca recriar com fonte de texto. O título "Trinity Hookah" do header usa a fonte de display normal.
- Não usar CSS Modules: a regra `*.css` do Turbopack em `next.config.ts` (loader do Tailwind) os trata como CSS global e as classes não ganham hash. CSS próprio vai em arquivo global com prefixo (ex.: `boot-*` em `features/loader/boot-loader.css`).

## Branches

Temas em uso: `chore/setup` (tooling/infra), `feat/loja` (vitrine, carrinho, checkout), `chore/deploy` (Vercel, SEO, domínio). Reaproveitar a branch do tema em vez de criar novas.
