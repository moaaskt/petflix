# Setup — Petflix

Guia detalhado para configurar o ambiente de desenvolvimento e o Firebase.

---

## 1. Pré-requisitos

| Ferramenta     | Versão mínima | Verificação                                                         |
| -------------- | ------------- | ------------------------------------------------------------------- |
| Node.js        | 18.x          | `node -v`                                                           |
| npm            | 9.x           | `npm -v`                                                            |
| Conta Firebase | —             | [console.firebase.google.com](https://console.firebase.google.com/) |
| Git            | qualquer      | `git --version`                                                     |

---

## 2. Clone e instalação

```bash
git clone https://github.com/moaaskt/petflix.git
cd petflix
npm install
```

---

## 3. Configuração do Firebase

### 3.1. Criar o projeto

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **Adicionar projeto**
3. Dê um nome (ex: `petflix-dev`) e siga os passos

### 3.2. Registrar o app web

1. No console do projeto, clique no ícone `</>` (Web)
2. Registre o app com um apelido (ex: `petflix-web`)
3. **Não** habilite Firebase Hosting por aqui (usamos Vercel)
4. Copie o objeto `firebaseConfig` exibido

### 3.3. Ativar Authentication

1. No menu lateral: **Build > Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, habilite **E-mail/senha**
4. Habilite também o envio de e-mail de verificação (padrão do Firebase)

### 3.4. Criar o banco Firestore

1. No menu lateral: **Build > Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha o modo **Produção** (regras restritivas)
4. Selecione a região mais próxima (ex: `southamerica-east1`)

### 3.5. Regras de segurança sugeridas (Firestore)

Adicione em **Firestore > Regras**:

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários só leem/editam seu próprio documento
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      // Admins podem ler qualquer documento de usuário
      allow read: if request.auth != null
                  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      // Subcoleção de perfis
      match /profiles/{profileId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }

    // Conteúdo: leitura para usuários autenticados, escrita apenas para admins
    match /content/{contentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

> ⚠️ **Modelo sugerido** — adapte conforme a necessidade do projeto. Valide em [Firebase Rules Playground](https://firebase.google.com/docs/rules/simulator).

---

## 4. Variáveis de ambiente

### 4.1. Arquivo `.env`

Copie o template e preencha com seus valores:

```bash
cp .env.example .env
```

```env
# .env (desenvolvimento local — NUNCA commitar)

VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=meu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meu-projeto
VITE_FIREBASE_STORAGE_BUCKET=meu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

> 🔒 O arquivo `.env` já está listado no `.gitignore`. **Nunca commite valores reais.**

### 4.2. Como o app consome as variáveis

O arquivo `src/config/firebase.js` lê as variáveis com o prefixo `VITE_` via `import.meta.env`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY
  // ...
};
```

Se qualquer variável estiver faltando, o app **lança um erro descritivo** antes de inicializar — impedindo falhas silenciosas em produção.

---

## 5. Criar o primeiro usuário Admin

O Petflix usa o campo `role: "admin"` no documento `users/{uid}` do Firestore para controle de acesso.

**Passo a passo:**

1. Registre um usuário normalmente pela interface (`/register`)
2. Verifique o e-mail clicando no link recebido
3. No `src/main.js`, descomente temporariamente:

```javascript
// await setAdminRole('seu-email@exemplo.com');
```

4. Execute `npm run dev` — a função `setAdminRole` (`src/utils/make-admin.js`) atualizará o Firestore
5. Recomente a linha e reinicie o servidor

> Após isso, o usuário terá acesso à rota `/admin`.

---

## 6. Popular o banco (seed)

Para popular o Firestore com conteúdo de exemplo, descomente no `src/main.js`:

```javascript
// await seedDatabase();       // Conteúdo mockado básico
// await populateDatabase(true); // Conteúdo curado com IDs reais do YouTube
```

Execute `npm run dev` uma vez, depois **recomente** as linhas para não repetir o seed.

---

## 7. Troubleshooting

### ❌ "Variáveis de ambiente do Firebase faltando"

**Causa**: arquivo `.env` não existe ou está incompleto.

**Solução**:

```bash
cp .env.example .env
# Preencha todas as 6 variáveis VITE_FIREBASE_*
```

---

### ❌ Erro de CORS ao carregar vídeos do YouTube

**Causa**: vídeos do YouTube são carregados via `<iframe>` — CORS não é aplicável neste caso. Se ocorrer, verifique se o domínio está na lista de domínios autorizados no Google Cloud Console do projeto Firebase.

**Solução**:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Selecione o projeto Firebase
3. API & Services > Credentials > selecione a API key
4. Em "Application restrictions", adicione seu domínio

---

### ❌ 404 ao dar refresh em rotas (ex: `/dashboard`)

**Causa**: o servidor não conhece as rotas da SPA.

**Solução local**: use `npm run preview` (Vite já configura o fallback) ou configure seu servidor local para redirecionar tudo para `index.html`.

**Em produção (Vercel)**: já está resolvido pelo `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

### ❌ "FirebaseError: Missing or insufficient permissions"

**Causa**: regras do Firestore bloqueando a operação.

**Solução**:

1. Verifique se o usuário está autenticado
2. Cheque se o e-mail foi verificado (obrigatório para `/dashboard`)
3. Revise as regras do Firestore no console

---

### ❌ Login bem-sucedido mas redireciona de volta para `/login`

**Causa**: race condition — o `requireAuth` verificou o estado antes do Firebase terminar de inicializar.

**Por que não ocorre**: o guard `requireAuth` em `src/router/routes.js` aguarda explicitamente `state.loading === false` antes de decidir. Se isso ocorrer, verifique se `initAuthState()` está sendo chamado antes de `initRouter()` em `src/main.js`.
