# Features — Petflix

Documentação de cada feature real do projeto, com localização no código e instruções de teste.

---

## 1. Autenticação (Auth)

**O que faz**: permite que usuários criem conta, façam login, recuperem senha e tenham e-mail verificado antes de acessar o catálogo.

### Onde está no código

| Arquivo                             | Responsabilidade                                      |
| ----------------------------------- | ----------------------------------------------------- |
| `src/pages/LoginPage.js`            | Formulário de login                                   |
| `src/pages/RegisterPage.js`         | Formulário de cadastro                                |
| `src/pages/ForgotPasswordPage.js`   | Recuperação de senha via e-mail                       |
| `src/services/auth/auth.service.js` | `signIn()`, `signOut()`, `getCurrentUser()`           |
| `src/state/AuthState.js`            | Estado global, `onAuthStateChanged`, ban listener     |
| `src/config/firebase.js`            | Inicialização do Firebase Auth com persistência local |

### Rotas

| Rota               | Acesso  | Guards |
| ------------------ | ------- | ------ |
| `/login`           | Público | —      |
| `/register`        | Público | —      |
| `/forgot-password` | Público | —      |

### Como testar

1. Acesse `/register` e crie uma conta
2. Verifique a caixa de entrada e clique no link de verificação
3. Faça login em `/login`
4. Teste recuperação de senha em `/forgot-password`
5. Tente acessar `/dashboard` sem autenticação — deve redirecionar para `/login`

---

## 2. Seleção de Perfil

**O que faz**: após login, o usuário escolhe assistir como **Cachorro** ou **Gato**. A escolha define o tema visual e o catálogo exibido.

### Onde está no código

| Arquivo                           | Responsabilidade                                                        |
| --------------------------------- | ----------------------------------------------------------------------- |
| `src/pages/home/HomePage.js`      | Tela de seleção ("Quem está assistindo?")                               |
| `src/services/profile.service.js` | CRUD de perfis (`users/{uid}/profiles`)                                 |
| `src/state/AuthState.js`          | `applyTheme(themeName)` — aplica `theme-dog` ou `theme-cat` ao `<body>` |
| `src/state/AppState.js`           | Estado do app (espécie selecionada)                                     |

### Rota

| Rota    | Acesso      | Guards        |
| ------- | ----------- | ------------- |
| `/home` | Autenticado | `requireAuth` |

### Firestore

Subcoleção `users/{uid}/profiles`:

```json
{ "name": "Rex", "species": "dog", "avatar": "URL", "isDefault": true }
```

---

## 3. Dashboard / Catálogo

**O que faz**: página principal após selecionar o perfil. Exibe o Hero destacado (carrossel), trilhas de conteúdo "Em Alta" e por categoria/gênero.

### Onde está no código

| Arquivo                                   | Responsabilidade                                            |
| ----------------------------------------- | ----------------------------------------------------------- |
| `src/pages/dashboard/DashboardPage.jsx`   | Página do catálogo                                          |
| `src/components/HeroFeatured.jsx`         | Banner principal                                            |
| `src/components/HeroFeaturedCarousel.jsx` | Carrossel do hero com múltiplos itens                       |
| `src/components/HeroFeaturedSlide.jsx`    | Slide individual do carrossel                               |
| `src/components/ContentRail.jsx`          | Linha horizontal de cards                                   |
| `src/components/ContentCard.jsx`          | Card individual de conteúdo                                 |
| `src/services/content.service.js`         | `getFeaturedMultiple()`, `getTrending()`, `getByCategory()` |

### Rota

| Rota         | Acesso                          | Guards                                |
| ------------ | ------------------------------- | ------------------------------------- |
| `/dashboard` | Autenticado + e-mail verificado | `requireAuth`, `requireEmailVerified` |

---

## 4. Categorias de Conteúdo

**O que faz**: páginas dedicadas para cada categoria de conteúdo, filtradas por espécie.

| Rota      | Tipo          | Arquivo                                     |
| --------- | ------------- | ------------------------------------------- |
| `/filmes` | Filmes        | `src/pages/movies/MoviesPage.jsx`           |
| `/series` | Séries        | `src/pages/categories/SeriesPage.js`        |
| `/docs`   | Documentários | `src/pages/categories/DocumentariesPage.js` |

Todas exigem `requireAuth` + `requireEmailVerified`.

### Serviço usado

```javascript
// src/services/content.service.js
getByCategory(species, 'movie'); // filmes
getByCategory(species, 'series'); // séries
getByCategory(species, 'doc'); // documentários
```

---

## 5. Player de Vídeo

**O que faz**: reproduz o vídeo selecionado, carregando o YouTube video ID armazenado no campo `videoId` da coleção `content`.

### Onde está no código

| Arquivo                          | Responsabilidade |
| -------------------------------- | ---------------- |
| `src/pages/player/PlayerPage.js` | Página do player |

### Rota

| Rota      | Acesso      | Guards        |
| --------- | ----------- | ------------- |
| `/player` | Autenticado | `requireAuth` |

### Como testar

1. Navegue até o dashboard
2. Clique em um conteúdo qualquer
3. O player deve abrir na rota `/player`

---

## 6. Minha Lista (Favoritos)

**O que faz**: permite que o usuário salve conteúdos em sua lista pessoal para assistir depois.

### Onde está no código

| Arquivo                        | Responsabilidade                 |
| ------------------------------ | -------------------------------- |
| `src/pages/MyListPage.js`      | Página de listagem dos favoritos |
| `src/services/list.service.js` | CRUD da lista do usuário         |

### Rota

| Rota       | Acesso                          | Guards                                |
| ---------- | ------------------------------- | ------------------------------------- |
| `/my-list` | Autenticado + e-mail verificado | `requireAuth`, `requireEmailVerified` |

---

## 7. Busca no Catálogo

**O que faz**: busca por título e descrição no catálogo completo (ou filtrado por espécie).

### Onde está no código

| Arquivo                           | Função                          |
| --------------------------------- | ------------------------------- |
| `src/services/content.service.js` | `searchContent(query, species)` |

A busca é feita **client-side** sobre os dados já carregados/cacheados — não faz chamada extra ao Firestore.

```javascript
// Retorna até 20 resultados
searchContent('marley', 'dog');
```

---

## 8. Minha Conta

**O que faz**: permite ao usuário visualizar e atualizar dados da conta.

### Onde está no código

| Arquivo                            | Responsabilidade |
| ---------------------------------- | ---------------- |
| `src/pages/account/AccountPage.js` | Página de conta  |

### Rota

| Rota     | Acesso      | Guards        |
| -------- | ----------- | ------------- |
| `/conta` | Autenticado | `requireAuth` |

---

## 9. Painel Administrativo (Admin)

**O que faz**: área restrita para administradores com dashboard de métricas, gerenciamento de conteúdo (CMS) e gerenciamento de usuários (CRM).

> Acesso restrito. Veja [SECURITY.md](SECURITY.md) para detalhes sobre RBAC.

### Onde está no código

| Arquivo                                 | Responsabilidade                     |
| --------------------------------------- | ------------------------------------ |
| `src/pages/admin/AdminDashboardPage.js` | Métricas com gráficos ApexCharts     |
| `src/pages/admin/AdminMoviesPage.js`    | CRUD de filmes/séries/documentários  |
| `src/pages/admin/AdminUsersPage.js`     | Listagem, banimento e reset de senha |
| `src/components/admin/`                 | Componentes específicos do admin     |

### Rotas

| Rota            | Acesso | Guards                        |
| --------------- | ------ | ----------------------------- |
| `/admin`        | Admin  | `requireAuth`, `requireAdmin` |
| `/admin/movies` | Admin  | `requireAuth`, `requireAdmin` |
| `/admin/users`  | Admin  | `requireAuth`, `requireAdmin` |

### Funcionalidades do CMS (`/admin/movies`)

- Criar novo conteúdo (filme, série ou documentário)
- Editar conteúdo existente
- Excluir conteúdo
- Marcar como `featured`, `trending` ou `original`

### Funcionalidades do CRM (`/admin/users`)

- Listar todos os usuários
- **Banir / Desbanir** — altera `status` no Firestore; o listener em `AuthState.js` força logout instantâneo do usuário banido
- **Reset de senha** — envia e-mail de redefinição via Firebase Auth
- **Ver perfis** — exibe os perfis criados pelo usuário

---

## 10. Banimento em Tempo Real

**O que faz**: ao banir um usuário no painel admin, ele é desconectado instantaneamente — mesmo que esteja com a sessão ativa.

### Como funciona

```
Admin altera users/{uid}.status → "banned"
        ↓
onSnapshot detecta mudança (AuthState.js:115)
        ↓
authService.signOut() → alert → redirect /login → reload
```

### Onde está no código

- `src/state/AuthState.js` — linhas 114–149
- `src/services/auth/auth.service.js` — `signOut()`

---

## 11. Seed do Banco de Dados

**O que faz**: utilitários para popular o Firestore com dados de exemplo durante desenvolvimento.

### Onde está no código

| Arquivo                     | Descrição                                |
| --------------------------- | ---------------------------------------- |
| `src/utils/seed-db.js`      | Dados mockados básicos                   |
| `src/utils/seed-content.js` | Conteúdo curado com IDs reais do YouTube |
| `src/utils/make-admin.js`   | Promove um e-mail para role `admin`      |

Esses utilitários são invocados manualmente via código comentado em `src/main.js`. Não são executados em produção.
