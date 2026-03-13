# 🏭 Sistema OTIF — Química Anastácio

## Guia de Configuração — GitHub Pages + Armazenamento GitHub

---

## 📁 Estrutura do Projeto

```
otif-sistema/
├── index.html           ← Site principal
├── github-storage.js    ← Módulo de conexão com GitHub API
├── data/
│   └── dados.json       ← Dados do sistema (clientes, faróis, ações, FNC)
└── README.md            ← Este guia
```

---

## 🚀 Passo a Passo

### 1. Criar o Repositório

1. Acesse o GitHub da empresa
2. Clique **New repository**
3. Nome: `otif-sistema` (ou o que preferir)
4. Visibilidade: **Private**
5. Marque: **Add a README file**
6. Clique **Create repository**

### 2. Fazer Upload dos Arquivos

1. No repositório, clique **Add file → Upload files**
2. Arraste os 3 arquivos: `index.html`, `github-storage.js`, e a pasta `data/dados.json`
3. Clique **Commit changes**

### 3. Gerar o Token de Acesso (Fine-grained PAT)

1. Acesse: **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
   (URL: https://github.com/settings/tokens?type=beta)
2. Clique **Generate new token**
3. Preencha:
   - **Token name**: `otif-sistema`
   - **Expiration**: 1 year (ou o que preferir)
   - **Repository access**: selecione **Only select repositories** → escolha `otif-sistema`
   - **Permissions → Repository permissions**:
     - **Contents**: Read and Write
     - Todo o resto pode ficar como "No access"
4. Clique **Generate token**
5. **COPIE O TOKEN** (ele começa com `github_pat_...` ou `ghp_...`)

### 4. Configurar o Token no Código

1. Abra o arquivo `github-storage.js` no repositório
2. Clique no lápis (Edit)
3. Preencha as 3 linhas:

```javascript
const GITHUB_CONFIG = {
  token: "github_pat_SEU_TOKEN_AQUI",    // Cole o token que gerou
  owner: "nome-da-organizacao",            // Nome da org no GitHub
  repo:  "otif-sistema",                   // Nome do repositório
  path:  "data/dados.json",
  branch: "main"
};
```

4. Clique **Commit changes**

### 5. Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Clique **Save**
5. Aguarde 1-2 minutos
6. O site ficará disponível em: `https://sua-org.github.io/otif-sistema/`

---

## ✅ Pronto!

Agora o sistema:
- Fica hospedado no GitHub Pages (gratuito)
- Salva todos os dados no arquivo `data/dados.json` via API
- Cada alteração gera um commit automático (versionamento)
- O repositório é privado (só quem tem acesso vê)

---

## 🔗 Integração com Microsoft Fabric

Para conectar os dados ao Fabric:

1. No Fabric, crie um **Dataflow Gen2**
2. Adicione fonte: **Web API** ou **REST**
3. URL: `https://api.github.com/repos/SUA-ORG/otif-sistema/contents/data/dados.json`
4. Headers:
   - `Authorization`: `Bearer SEU_TOKEN`
   - `Accept`: `application/vnd.github.v3.raw`
5. O Fabric recebe o JSON com todos os dados
6. Transforme e carregue no Lakehouse/Warehouse
7. Agende atualização automática

---

## ⚠️ Observações

- **Token no código**: O token fica visível no JavaScript. Como o repo é privado e o acesso é controlado, o risco é baixo. O token tem permissão APENAS neste repositório.
- **Limite de API**: 5.000 requisições/hora (mais que suficiente para uso interno)
- **Debounce**: O sistema aguarda 1.5 segundos após a última alteração antes de salvar no GitHub, evitando commits excessivos
- **Logos de clientes**: São salvos como Base64 dentro do JSON. Logos grandes podem aumentar o tamanho do arquivo.
