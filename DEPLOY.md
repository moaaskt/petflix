# 🚀 Guia de Deploy - Petflix na Vercel

Este guia descreve como fazer o deploy do Petflix na Vercel.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Conta no [Firebase](https://console.firebase.google.com/)
- Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Configuração Local

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e preencha com suas credenciais do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=seu-auth-domain.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-project-id
   VITE_FIREBASE_STORAGE_BUCKET=seu-storage-bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```

3. Para obter essas credenciais:
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Selecione seu projeto (ou crie um novo)
   - Vá em **Project Settings** > **General**
   - Role até "Your apps" e clique no ícone de configuração do app web
   - Copie os valores do objeto `firebaseConfig`

### 3. Teste o build localmente

```bash
npm run build
```

Se o build for bem-sucedido, você está pronto para fazer o deploy!

## 🌐 Deploy na Vercel

### Opção 1: Deploy via Dashboard (Recomendado)

1. **Conecte seu repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New..." > "Project"
   - Conecte seu repositório Git

2. **Configure o projeto**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (padrão)
   - Output Directory: `dist` (padrão)
   - Install Command: `npm install` (padrão)

3. **Configure as variáveis de ambiente**
   - Na seção "Environment Variables", adicione todas as variáveis do Firebase:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - ⚠️ **IMPORTANTE**: Configure para **Production**, **Preview** e **Development**

4. **Clique em "Deploy"**

### Opção 2: Deploy via CLI

1. **Instale a Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Faça login**
   ```bash
   vercel login
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   ```

4. **Faça o deploy**
   ```bash
   vercel --prod
   ```

## ✅ Configuração de Rotas (SPA)

O arquivo `vercel.json` já está configurado para garantir que todas as rotas sejam redirecionadas para `index.html`, permitindo que o roteamento client-side funcione corretamente.

### O que está configurado:

- **Rewrites**: Todas as rotas (`/*`) redirecionam para `/index.html`
- **Headers de Segurança**: 
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
- **Cache de Assets**: Assets estáticos com cache de 1 ano

## 🔍 Verificações Pós-Deploy

Após o deploy, verifique:

1. ✅ A aplicação carrega sem erros no console
2. ✅ As rotas funcionam corretamente (sem 404)
3. ✅ O Firebase está conectado (teste login/registro)
4. ✅ As imagens e assets carregam corretamente

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente do Firebase faltando"

**Solução**: Certifique-se de que todas as variáveis de ambiente estão configuradas no painel da Vercel com o prefixo `VITE_`.

### Erro: 404 em rotas após refresh

**Solução**: Verifique se o arquivo `vercel.json` está na raiz do projeto e tem a configuração de rewrites.

### Build falha localmente

**Solução**: Certifique-se de que o arquivo `.env` existe e está preenchido corretamente. O build falhará se as variáveis estiverem ausentes.

## 📝 Notas Importantes

- ⚠️ **Nunca commite o arquivo `.env`** no Git (já está no `.gitignore`)
- ✅ O arquivo `.env.example` pode ser commitado (serve como template)
- 🔒 As variáveis de ambiente são injetadas durante o build na Vercel
- 🌍 Após o deploy, a Vercel fornecerá uma URL automática (ex: `petflix.vercel.app`)

## 🔄 Atualizações Futuras

Para atualizar a aplicação:

1. Faça push das alterações para o repositório Git
2. A Vercel automaticamente fará um novo deploy
3. Ou execute manualmente: `vercel --prod`

---

**Pronto!** Sua aplicação está configurada para produção na Vercel! 🎉
