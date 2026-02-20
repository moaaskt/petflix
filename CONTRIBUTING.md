# Contribuindo com o Petflix

Obrigado pelo interesse em contribuir! Este documento descreve o fluxo de trabalho para contribuições.

---

## Pré-requisitos

- Node.js >= 18
- npm >= 9
- Leia o [SETUP.md](docs/SETUP.md) para configurar o ambiente

---

## Fluxo de contribuição

### 1. Fork e clone

```bash
git clone https://github.com/seu-usuario/petflix.git
cd petflix
npm install
cp .env.example .env
# Preencha .env com suas credenciais Firebase
```

### 2. Crie uma branch

Use o padrão:

```bash
git checkout -b feat/nome-da-feature
git checkout -b fix/descricao-do-bug
git checkout -b docs/o-que-foi-documentado
```

### 3. Desenvolva

- Siga os padrões de código descritos abaixo
- Não importe Firebase diretamente em componentes — use `src/services/`
- Mantenha a separação de camadas (ver [ARCHITECTURE.md](docs/ARCHITECTURE.md))

### 4. Verifique qualidade

```bash
# Lint
npx eslint src/

# Build (garante que nada está quebrado)
npm run build
```

### 5. Commit

Use mensagens de commit seguindo [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona pesquisa global na navbar
fix: corrige redirecionamento após login em dispositivos móveis
docs: atualiza SETUP.md com novas instruções do Firebase
refactor: extrai lógica de cache para hook useCachedContent
```

### 6. Pull Request

1. Faça push da branch: `git push origin feat/nome-da-feature`
2. Abra um Pull Request no GitHub apontando para `main`
3. Descreva o que foi feito e por quê
4. Aguarde revisão

---

## Padrões de código

- **Formatação**: Prettier (`.prettierrc`)
- **Lint**: ESLint (`.eslintrc.js`)
- **EditorConfig**: `.editorconfig` (UTF-8, LF, indent 2 espaços)
- Arquivos em `src/pages/` usam sufixo `Page` (ex: `DashboardPage.jsx`)
- Arquivos em `src/services/` usam sufixo `.service.js`
- Evite `console.log` em código de produção — use `console.warn` ou `console.error` apenas quando necessário

---

## Reportar bugs

Abra uma [Issue no GitHub](https://github.com/moaaskt/petflix/issues) com:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots (se aplicável)
- Ambiente (browser, OS)

---

## Sugestão de features

Abra uma Issue com o label `enhancement` descrevendo:

- O problema que a feature resolve
- A solução proposta
- Alternativas consideradas

---

## Licença

Ao contribuir, você concorda que sua contribuição será licenciada sob a [MIT License](LICENSE).
