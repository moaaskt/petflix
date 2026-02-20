# Deploy — Petflix

Guia de deploy do Petflix na **Vercel** (plataforma de deploy configurada no projeto).

> Para configuração do Firebase antes do deploy, consulte [SETUP.md](SETUP.md).

---

## Pré-requisitos

- [ ] Conta em [vercel.com](https://vercel.com)
- [ ] Repositório no GitHub/GitLab/Bitbucket
- [ ] Projeto Firebase configurado com Auth e Firestore
- [ ] Build local funcionando (`npm run build`)

---

## Testar o build localmente

```bash
npm run build     # Gera a pasta dist/
npm run preview   # Serve o build em http://localhost:4173
```

Se o build falhar, verifique se o arquivo `.env` existe e está com todas as variáveis preenchidas.

---

## Opção 1 — Deploy via Dashboard (Recomendado)

### 1. Importar o projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **Import Git Repository**
3. Conecte sua conta GitHub e selecione o repositório `petflix`

### 2. Configurar o projeto

| Campo            | Valor           |
| ---------------- | --------------- |
| Framework Preset | **Vite**        |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |

### 3. Adicionar variáveis de ambiente

Na seção **Environment Variables**, adicione as 6 variáveis. Marque todas para **Production**, **Preview** e **Development**:

| Variável                            | Onde encontrar                                |
| ----------------------------------- | --------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_AUTH_DOMAIN`         | idem                                          |
| `VITE_FIREBASE_PROJECT_ID`          | idem                                          |
| `VITE_FIREBASE_STORAGE_BUCKET`      | idem                                          |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | idem                                          |
| `VITE_FIREBASE_APP_ID`              | idem                                          |

### 4. Deploy

Clique em **Deploy**. A Vercel fará o build e publicará automaticamente.

---

## Opção 2 — Deploy via CLI

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Adicionar variáveis de ambiente
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID

# Deploy de produção
vercel --prod
```

---

## Configuração de SPA (vercel.json)

O arquivo `vercel.json` na raiz já está configurado para o roteamento client-side funcionar:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Isso garante que qualquer rota (ex: `/dashboard`, `/admin`) seja tratada pela SPA em vez de retornar 404.

### Headers de segurança configurados

| Header                   | Valor                                 |
| ------------------------ | ------------------------------------- |
| `X-Content-Type-Options` | `nosniff`                             |
| `X-Frame-Options`        | `DENY`                                |
| `X-XSS-Protection`       | `1; mode=block`                       |
| `Cache-Control` (assets) | `public, max-age=31536000, immutable` |

---

## Atualizações futuras

A Vercel cria um deploy automático a cada push para a branch principal:

1. Faça suas alterações
2. `git push origin main`
3. A Vercel detecta e faz o deploy automaticamente

Para deploy manual:

```bash
vercel --prod
```

---

## Verificações pós-deploy

Após o deploy, verifique:

- [ ] A aplicação carrega sem erros no console do navegador
- [ ] As rotas funcionam sem 404 (ex: dê F5 em `/dashboard`)
- [ ] Login e cadastro funcionam via Firebase
- [ ] Variáveis de ambiente estão configuradas (se o Firebase não conectar, provavelmente faltam variáveis)

---

## Domínio customizado (opcional)

1. Em **Vercel > Settings > Domains**
2. Adicione seu domínio
3. Configure os registros DNS conforme indicado pela Vercel
4. No Firebase Console, adicione o domínio customizado em **Authentication > Settings > Authorized domains**

---

## Rollback

Para reverter para um deploy anterior:

1. Acesse **Vercel > Deployments**
2. Encontre o deploy anterior
3. Clique em **...** > **Promote to Production**
