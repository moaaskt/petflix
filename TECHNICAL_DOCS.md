# Documentação Técnica - Petflix

> **Versão:** 2.0.0
> **Status:** Atualizado
> **Data:** Dezembro/2025

Este documento serve como guia de referência técnica para a arquitetura, segurança e módulos do sistema Petflix.

## 1. Visão Geral e Tech Stack

O Petflix é uma plataforma de streaming single-page application (SPA) focada em entretenimento para pets.

### Frontend Core
- **Framework:** React 19 (via Vite)
- **Linguagem:** JavaScript (ES Modules)
- **Estilização:** Tailwind CSS v4 (Utility-first CSS)
- **Roteamento:** Custom Router (baseado em hash/history API) ou React Router (verificar implementação)
- **Gerenciamento de Estado:** Context API (`AuthState`) + Local State

### Backend & Infraestrutura (Firebase)
- **Authentication:** Gerenciamento de usuários e sessões.
- **Firestore Database:** Banco de dados NoSQL para dados de usuários, perfis e catálogo.
- **Storage:** Armazenamento de assets de mídia (se aplicável).

---

## 2. Arquitetura do Projeto

O projeto segue uma arquitetura baseada em **Camada de Serviços**, separando estritamente a lógica de negócios da interface do usuário.

### Camada de Serviços (`src/services/*`)
A pasta `services` atua como a única ponte entre os componentes React e o Firebase.
- **Isolamento:** Os componentes (Pages/Views) não importam funções do Firebase diretamente. Eles chamam serviços como `auth.service.js` ou `content.service.js`.
- **Tratamento de Erros:** Os serviços capturam erros do Firebase e retornam objetos padronizados para o frontend.

### Estrutura de Diretórios
```
src/
├── components/       # Componentes reutilizáveis de UI
├── config/           # Configurações globais (ex: firebase.js)
├── pages/            # Views principais (Roteáveis)
│   ├── account/      # Páginas de conta do usuário
│   ├── admin/        # Módulo Administrativo (CMS/CRM)
│   ├── categories/   # Páginas de listagem (Filmes, Séries)
│   ├── dashboard/    # Dashboard do Usuário
│   ├── home/         # Landing Page / Seleção de Perfil
│   └── player/       # Reprodutor de vídeo
├── router/           # Configuração de rotas e Guards
├── services/         # Lógica de Negócios e API
│   ├── api/          # Wrappers de baixo nível
│   └── *.service.js  # Serviços de domínio (User, Profile, Content)
├── state/            # Estado Global (AuthState)
└── utils/            # Helpers e funções utilitárias
```

---

## 3. Autenticação e Segurança (Crucial)

O sistema de segurança é robusto e inclui monitoramento em tempo real para enforcement de banimentos.

### Fluxo de Autenticação
1. **Login/Registro:** Utiliza `firebase/auth`. O estado do usuário é persistido e sincronizado via `AuthState.js`.
2. **Sessão:** Monitorada por `onAuthStateChanged`.

### 🛡️ Sistema de Banimento em Tempo Real
Esta é uma funcionalidade crítica de segurança.
- **Monitoramento:** O `AuthState.js` inicia um listener `onSnapshot` no documento `users/{uid}` do usuário logado.
- **Mecanismo de "Hard Kick":**
  - Se o campo `status` no Firestore mudar para `'banned'`, o sistema dispara um logout forçado imediatamente.
  - A aplicação força um `window.location.reload()` para limpar qualquer estado em memória, garantindo que o usuário não permaneça na plataforma.

### Route Guards (Middlewares)
As rotas são protegidas por middlewares definidos em `router/routes.js`:
- **`requireAuth`**: Verifica se existe um usuário logado. Redireciona para `/login`.
- **`requireAdmin`**: Verifica se o usuário possui a role `admin`.
  - Verifica primeiro no estado local.
  - Se necessário, busca a role atualizada no Firestore via `getUserRole`.
  - Se falhar, redireciona para o Dashboard de usuário comum.

---

## 4. Módulos do Sistema

### Cliente (User Facing)
- **Home:** Landing page e Seleção de Perfis (Quem está assistindo?).
- **Dashboard:** Catálogo principal com Destaques, Trending e Categorias.
- **Player:** Interface de reprodução de vídeo.
- **Minha Lista:** Lista de favoritos do usuário.

### Admin (CMS & CRM)
Acesso restrito via rota `/admin`.
- **Dashboard Admin:** Visão geral de métricas.
- **Gestão de Filmes (CMS):**
  - CRUD completo de filmes/séries.
  - Definição de destaques e originais.
- **Gestão de Usuários (CRM):**
  - Tabela listando todos os usuários.
  - **Ações:**
    - **Banir/Desbanir:** Altera o status em tempo real.
    - **Resetar Senha:** Envia email de recuperação.
    - **Ver Perfis:** Visualiza os perfis criados pelo usuário (Cachorro, Gato, etc.).

---

## 5. Esquema do Banco de Dados (Firestore)

O banco de dados é NoSQL (Firestore). Abaixo estão as coleções principais.

### `users` (Coleção Raiz)
Armazena dados da conta principal.
```json
{
  "uid": "string (PK)",
  "email": "string",
  "role": "user" | "admin",
  "status": "active" | "banned",
  "createdAt": "timestamp"
}
```

### `profiles` (Subcoleção: `users/{uid}/profiles`)
Armazena os perfis de visualização de cada conta.
```json
{
  "id": "string (Auto-ID)",
  "name": "string",
  "species": "dog" | "cat",
  "avatar": "string (URL)",
  "isDefault": "boolean",
  "createdAt": "timestamp"
}
```

### `content` (Coleção Raiz)
Armazena todo o catálogo (Filmes, Séries, Documentários).
> Nota: Anteriormente referida como "movies", agora unificada em "content".
```json
{
  "id": "string (Auto-ID)",
  "title": "string",
  "description": "string",
  "type": "movie" | "series" | "doc",
  "species": "dog" | "cat",      // Público alvo
  "genre": "action" | "drama" | "comedy" | "adventure",
  "videoId": "string",            // ID do YouTube ou URL
  "image": "string (URL)",        // Thumbnail
  "featured": "boolean",          // Destaque no Hero
  "trending": "boolean",          // Aparece em "Em Alta"
  "original": "boolean"           // Original Petflix
}
```
