# Segurança — Petflix

Modelo de permissões, riscos conhecidos e boas práticas de segurança para o projeto.

---

## Modelo de Permissões (RBAC)

O Petflix implementa **Role-Based Access Control** com dois níveis de acesso.

### Roles

| Role          | Valor no Firestore | Acesso                                                 |
| ------------- | ------------------ | ------------------------------------------------------ |
| Usuário comum | `role: "user"`     | Dashboard, catálogo, player, minha lista, perfil       |
| Administrador | `role: "admin"`    | Tudo acima + `/admin`, `/admin/movies`, `/admin/users` |

### Como a role é definida

A role é armazenada no documento `users/{uid}` no Firestore:

```json
{
  "uid": "abc123",
  "email": "admin@exemplo.com",
  "role": "admin",
  "status": "active"
}
```

### Como promover um usuário a admin

Utilize o utilitário `src/utils/make-admin.js`, descomentando a chamada em `src/main.js`:

```javascript
// src/main.js
await setAdminRole('email@exemplo.com');
```

> ⚠️ **Recomente imediatamente após executar** para não promover automaticamente em cada inicialização.

---

## Guards de Rota

Implementados em `src/router/routes.js`. Todos os middlewares são funções assíncronas.

### `requireAuth` (linha 23)

```
Verifica: state.user !== null
Aguarda:  state.loading === false (inicialização assíncrona do Firebase)
Redireciona para: /login
```

### `requireEmailVerified` (linha 63)

```
Verifica: state.user.emailVerified === true
Redireciona para: /home
Exceção: se já está em /home, permite acesso (evitar loop)
```

### `requireAdmin` (linha 95)

```
Verifica: role === "admin"
Fonte 1:  AuthState (cache em memória)
Fonte 2:  getUserRole(uid) no Firestore (se não estiver no estado)
Redireciona para: /dashboard
Exibe:    Toast.error("Acesso restrito a administradores")
```

---

## Banimento em Tempo Real

### Mecanismo

Ao banir um usuário no painel admin (`/admin/users`), o campo `status` é alterado para `"banned"` no Firestore. O listener `onSnapshot` em `src/state/AuthState.js` (linha 115) detecta a mudança e:

1. Cancela o listener
2. Chama `authService.signOut()`
3. Exibe alerta ao usuário
4. Redireciona para `/#/login`
5. Força `window.location.reload()` para limpar estado em memória

Isso garante que **mesmo uma sessão ativa** seja encerrada sem que o usuário precise interagir.

### Campo de status

| Valor      | Comportamento                |
| ---------- | ---------------------------- |
| `"active"` | Sessão permitida normalmente |
| `"banned"` | Logout forçado imediato      |

---

## Proteção de Chaves

### O que NÃO fazer

```bash
# ❌ NUNCA commite o .env
git add .env
git commit -m "adiciona config"
```

### O que fazer

1. `.env` está no `.gitignore` — nunca remova essa entrada
2. Use `.env.example` como template (sem valores reais) — pode ser commitado
3. Configure variáveis de ambiente no painel da Vercel para produção
4. Rotacione as chaves imediatamente se uma delas vazar

### Verificar vazamento

```bash
# Verifica se .env está sendo rastreado pelo git
git ls-files | grep .env
# Se retornar ".env" (sem .example), o arquivo está rastreado — remova imediatamente:
git rm --cached .env
```

---

## Chave da YouTube API

O arquivo `src/config/constants.js` contém uma chave da YouTube API hardcoded (`YOUTUBE_CONFIG.API_KEY`).

> ⚠️ **Risco**: chaves hardcoded no código-fonte são expostas no bundle JavaScript de produção, que é público.

**Situação atual**: a chave aparece em `constants.js` mas o serviço principal `src/services/youtube.service.js` pode ou não utilizá-la — **verifique se `youtube.service.js` referencia `YOUTUBE_CONFIG.API_KEY`**.

**Recomendação**: mover a chave para uma variável de ambiente com prefixo `VITE_`:

```env
VITE_YOUTUBE_API_KEY=sua_chave_aqui
```

E referenciar em `constants.js`:

```javascript
export const YOUTUBE_CONFIG = {
  API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY
  // ...
};
```

---

## Headers de Segurança HTTP

Configurados em `vercel.json` para **todas as rotas**:

| Header                   | Valor           | Proteção                               |
| ------------------------ | --------------- | -------------------------------------- |
| `X-Content-Type-Options` | `nosniff`       | Previne MIME sniffing                  |
| `X-Frame-Options`        | `DENY`          | Previne clickjacking                   |
| `X-XSS-Protection`       | `1; mode=block` | Proteção XSS legada (browsers antigos) |

---

## Regras do Firestore (Modelo)

> As regras abaixo são um **modelo sugerido**. Verifique e valide no [Firebase Rules Playground](https://firebase.google.com/docs/rules/simulator) antes de aplicar em produção.

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuário acessa apenas seu próprio documento
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      // Admin pode ler qualquer usuário (para CRM)
      allow read, write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      match /profiles/{profileId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }

    // Conteúdo: leitura para autenticados, escrita para admins
    match /content/{contentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Riscos e Mitigações

| Risco                        | Severidade | Mitigação atual                                 | Recomendação                                      |
| ---------------------------- | ---------- | ----------------------------------------------- | ------------------------------------------------- |
| Chave YouTube hardcoded      | Médio      | —                                               | Mover para variável de ambiente                   |
| Regras Firestore abertas     | Alto       | Não existe arquivo de rules no repo             | Aplicar modelo acima                              |
| Escalada de privilege (role) | Médio      | Role verificada no Firestore via `requireAdmin` | Adicionar validação server-side (Cloud Functions) |
| Sessão de usuário banido     | Baixo      | Logout em tempo real via `onSnapshot`           | Implementado                                      |
| Exposição de `.env`          | Alto       | `.gitignore` configurado                        | Nunca remover entrada do `.gitignore`             |
