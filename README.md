# Txatiní — Plataforma de Venda de Temperos

MVP de e-commerce mobile-first com checkout simples e confirmação automática via WhatsApp.

Stack: **Next.js 15 (App Router) + TypeScript + TailwindCSS + Supabase + Vercel**

---

## 1. Configuração inicial

### 1.1 Instalar dependências

```bash
npm install
```

### 1.2 Variáveis de ambiente

O ficheiro `.env.local` já está criado com:
- A tua chave pública do Supabase (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- O número de WhatsApp Business (`NEXT_PUBLIC_WHATSAPP_NUMBER=258879197409`)

**Falta apenas uma coisa**: substituir o `NEXT_PUBLIC_SUPABASE_URL` pelo URL real do teu projeto.

Encontra-o em: **Supabase Dashboard → Project Settings → API → Project URL**
(formato: `https://xxxxxxxxxxxxx.supabase.co`)

Abre `.env.local` e troca esta linha:
```
NEXT_PUBLIC_SUPABASE_URL=https://SUBSTITUI-PELO-TEU-PROJECT-URL.supabase.co
```

### 1.3 Criar as tabelas no Supabase

> **Nota**: Este projeto Supabase é partilhado com outros projetos Vercel da tua organização. Por isso, todas as tabelas do Txatiní vivem isoladas num schema Postgres próprio chamado **`txatini`** (em vez do `public` partilhado), para nunca colidir com tabelas de outros projetos.

1. Vai ao teu projeto em [supabase.com](https://supabase.com)
2. Abre **SQL Editor**
3. Copia todo o conteúdo de `supabase/schema.sql`
4. Cola e clica **Run**

Isto cria:
- O schema `txatini` e as tabelas `txatini.products`, `txatini.orders`, `txatini.order_items`
- Regras de segurança (RLS): a loja é pública para leitura, só admins autenticados gerem produtos e veem pedidos
- Um bucket de Storage `txatini-product-images` (nome prefixado para não colidir com buckets de outros projetos)
- 4 produtos de exemplo (podes apagar depois no admin)

5. **Passo extra obrigatório** (só necessário porque usamos um schema customizado): vai a **Project Settings → API → Exposed schemas** e adiciona `txatini` à lista (por defeito só `public` está exposto à API REST). Sem isto, o site não consegue ler nem escrever nas tabelas.

### 1.4 Criar o teu utilizador admin

1. No Supabase Dashboard → **Authentication → Users → Add user**
2. Cria com o teu email e palavra-passe
3. Usa essas credenciais para entrar em `/admin/login`

> Não há registo público — só tu (ou quem criares manualmente no Supabase) acede ao painel admin.

### 1.5 Correr localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

- Loja: `/`, `/loja`, `/loja/[id]`, `/carrinho`, `/checkout`
- Admin: `/admin/login`

---

## 2. Deploy no Vercel

1. Sobe este projeto para um repositório GitHub
2. Em [vercel.com](https://vercel.com), importa o repositório
3. Em **Environment Variables**, adiciona as 3 variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Deploy.

---

## 3. Como funciona o fluxo de compra

```
Home → Loja → Produto → Carrinho → Checkout → WhatsApp (mensagem pré-preenchida)
```

No checkout, ao submeter:
1. O pedido é guardado no Supabase (`orders` + `order_items`) com status `pendente`
2. É aberta uma nova aba do WhatsApp com a mensagem do pedido já escrita, pronta a enviar
3. O cliente é redirecionado para `/pedido-sucesso`

Cada produto também tem um botão **"Comprar no WhatsApp"** para compra direta, sem passar pelo carrinho.

---

## 4. Painel Admin (`/admin`)

- **Dashboard**: totais de pedidos, pendentes, produtos ativos
- **Produtos**: criar, editar, ativar/desativar, apagar — com upload de imagem para o Supabase Storage
- **Pedidos**: lista com filtro por status, detalhe expansível com itens, atualização de status (pendente → em preparação → entregue)

Acesso protegido por `middleware.ts` — qualquer rota `/admin/*` exige sessão Supabase válida.

---

## 5. Estrutura do projeto

```
txatini/
├── app/
│   ├── layout.tsx, page.tsx          # Home
│   ├── loja/                          # Listagem + produto individual
│   ├── carrinho/
│   ├── checkout/
│   ├── pedido-sucesso/
│   ├── admin/                         # Painel protegido
│   └── api/create-order/              # Cria pedido no Supabase
├── components/                        # Navbar, ProductCard, CartItem, etc.
├── lib/
│   ├── supabase/client.ts e server.ts
│   ├── whatsapp.ts                    # Geração de mensagens e links wa.me
│   └── cart-store.ts                  # Estado do carrinho (zustand + localStorage)
├── hooks/                             # useCart, useProducts
├── types/                             # product.ts, order.ts, cart.ts
├── supabase/schema.sql                # Schema completo + RLS + storage
└── middleware.ts                      # Proteção de rotas /admin
```

---

## 6. Preparado para o futuro (não implementado no MVP)

O código já está estruturado para, mais tarde:
- Adicionar pagamento M-Pesa/e-Mola (basta um novo método em `lib/` + campo `payment_status` em `orders`)
- Sistema de revendedores e códigos de afiliado (tabela `users` com `role` e `referral_code`)
- Tracking de entregas (novo campo `status` mais granular ou tabela `deliveries`)
- App mobile (a mesma API `/api/create-order` e tabelas Supabase podem servir um app React Native)

---

## 7. Notas importantes

- **Mobile-first**: testado para ecrãs pequenos primeiro; grelhas expandem em ecrãs maiores
- **Internet lenta**: imagens otimizadas via `next/image`, sem bibliotecas pesadas desnecessárias
- **WhatsApp como canal principal**: botão fixo sempre visível, mensagens pré-preenchidas em todos os pontos de compra
- O carrinho persiste no `localStorage` do telemóvel do cliente (não se perde ao fechar o browser)
