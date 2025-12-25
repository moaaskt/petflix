# 🐾 Petflix

Plataforma de streaming voltada para animais de estimação, oferecendo vídeos do YouTube organizados em categorias (filmes, séries, documentários) para entreter cães e gatos.

---
![Tela de Login Petflix](https://raw.githubusercontent.com/moaaskt/petflix/refs/heads/main/public/assets/FireShot%20Capture%20089%20-%20PetFlix%20-%20Login%20-%20%5Bflixpet.netlify.app%5D.png)
## 📋 Resumo

O Petflix é uma aplicação web que simula um serviço de streaming para pets. Utiliza Firebase para autenticação e YouTube Data API para buscar e exibir vídeos adequados para animais de estimação. A interface permite seleção de perfil (Cachorro/Gato) e navegação por diferentes categorias de conteúdo.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização
- **JavaScript (ES6+)** - Lógica da aplicação
- **Bootstrap 5.3.2** - Framework CSS
- **Font Awesome 6.4.2** - Ícones
- **Firebase 9.6.0** - Autenticação e Realtime Database
- **YouTube Data API v3** - Busca de vídeos
- **YouTube IFrame API** - Player de vídeos

---

## 📁 Estrutura de Pastas

```
petflix/
├── assets/              # Imagens, logos e recursos visuais
├── css/                 # Folhas de estilo
├── JS/                  # Scripts JavaScript
│   ├── firebase-config.js
│   ├── firebase-auth.js
│   ├── youtube-api.js
│   ├── youtube-render.js
│   ├── index.js
│   ├── register.js
│   └── loading*.js
├── pagesFooter/         # Páginas informativas
├── index.html           # Login
├── register.html        # Cadastro
├── home.html            # Seleção de perfil
├── indexcach.html       # Dashboard cachorros
├── indexgato.html       # Dashboard gatos
├── filmes.html          # Filmes
├── series.html          # Séries
└── docs.html            # Documentários
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Navegador moderno
- Servidor HTTP local (opcional)
- Conta Firebase
- Chave da API do YouTube (opcional)

### Passos

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd petflix
   ```

2. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication (Email/Password) e Realtime Database
   - Copie `JS/firebase-config.local.example.js` para `JS/firebase-config.local.js`
   - Preencha suas credenciais no arquivo criado

3. **Configure YouTube API (opcional)**
   - Crie uma chave no [Google Cloud Console](https://console.cloud.google.com/)
   - Ative YouTube Data API v3
   - Adicione a chave em `JS/firebase-config.local.js`:
     ```javascript
     window.__PETFLIX_KEYS = {
       youtube: { apiKey: "SUA_CHAVE" }
     };
     ```

4. **Execute o servidor**
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server -p 8000
   
   # PHP
   php -S localhost:8000
   ```

5. **Acesse**
   ```
   http://localhost:8000
   ```

---

## 📦 Deploy

### GitHub Pages

1. Faça push do código para o GitHub
2. Vá em Settings > Pages
3. Selecione branch `main` e pasta `/root`
4. Acesse `https://seu-usuario.github.io/petflix/`

### Netlify

1. Instale o CLI: `npm install -g netlify-cli`
2. Faça login: `netlify login`
3. Deploy: `netlify deploy --prod`

### Firebase Hosting

1. Instale o CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Inicialize: `firebase init hosting`
4. Deploy: `firebase deploy --only hosting`

---

## 📄 Arquivos Principais

### `index.html`
Página de login com autenticação Firebase. Valida credenciais e redireciona para seleção de perfil.

### `home.html`
Tela de seleção de perfil (Cachorro/Gato). Protegida por autenticação.

### `indexcach.html` / `indexgato.html`
Dashboards específicos por espécie. Integram YouTube API para buscar e exibir vídeos.

### `filmes.html` / `series.html` / `docs.html`
Páginas de categorias com carrosséis de conteúdo. Exibem vídeos em modais.

### `JS/firebase-config.js`
Inicializa Firebase e expõe `window.auth` e `window.db` para uso global.

### `JS/firebase-auth.js`
Gerencia autenticação e proteção de rotas. Funções: `checkAuth()`, `logout()`.

### `JS/youtube-api.js`
Função `searchVideos()` que busca vídeos na YouTube Data API com filtros de segurança.

### `JS/youtube-render.js`
Renderiza player (`renderPlayer()`) e grid de vídeos (`renderGrid()`) na interface.

### `JS/index.js`
Lógica do formulário de login: validação, autenticação Firebase, recuperação de senha.

### `JS/register.js`
Lógica de cadastro: criação de usuário, envio de verificação de email, salvamento no database.

---

## 🔧 Possíveis Melhorias

- **Refatoração**: Consolidar código duplicado entre páginas de cachorro/gato em módulos compartilhados
- **Performance**: Implementar lazy loading de imagens e minificação de assets
- **Funcionalidades**: Adicionar busca global, favoritos e sistema de recomendações
- **Acessibilidade**: Melhorar navegação por teclado e suporte a leitores de tela
- **Testes**: Adicionar testes automatizados (unitários e E2E)
- **Modularização**: Separar lógica de dados dos arquivos HTML para arquivos JS dedicados

---

## 📄 Licença

MIT

---

<p align="center">
  Feito com ❤️ para pets e seus tutores
</p>
