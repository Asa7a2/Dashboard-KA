

// ═══════════════════════════════════════════════
// GITHUB STORAGE - Configuração
// ═══════════════════════════════════════════════
// ⚠️ PREENCHA OS 3 CAMPOS ABAIXO:
const GITHUB_CONFIG = {
  token: "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",           // Fine-grained PAT
  owner: "Asa7a2",                     // Nome da org ou usuário do GitHub
  repo:  "Dashboard-KA",                        // Nome do repositório
  path:  "data/dados.json",                     // Caminho do arquivo no repo
  branch: "main"                                // Branch principal
};

// ═══════════════════════════════════════════════
// FUNÇÕES DE LEITURA/ESCRITA
// ═══════════════════════════════════════════════

let _fileSha = null; // SHA do arquivo (necessário para atualizar)

// Ler dados do GitHub
async function githubLoad() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}&t=${Date.now()}`;
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${GITHUB_CONFIG.token}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.log("Arquivo não encontrado, será criado no primeiro salvamento.");
        return null;
      }
      throw new Error(`GitHub API: ${res.status}`);
    }

    const json = await res.json();
    _fileSha = json.sha;

    // Decodificar conteúdo Base64
    const content = atob(json.content.replace(/\n/g, ""));
    const data = JSON.parse(content);
    return data;

  } catch (e) {
    console.error("Erro ao carregar do GitHub:", e);
    return null;
  }
}

// Salvar dados no GitHub
async function githubSave(data) {
  try {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    
    const body = {
      message: `Atualização OTIF - ${new Date().toLocaleString("pt-BR")}`,
      content: content,
      branch: GITHUB_CONFIG.branch
    };

    // Se o arquivo já existe, precisamos do SHA
    if (_fileSha) {
      body.sha = _fileSha;
    }

    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${GITHUB_CONFIG.token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`GitHub API ${res.status}: ${err.message || ""}`);
    }

    const result = await res.json();
    _fileSha = result.content.sha; // Atualizar SHA para próxima escrita
    return true;

  } catch (e) {
    console.error("Erro ao salvar no GitHub:", e);
    return false;
  }
}

// Verificar se a configuração está preenchida
function githubConfigValid() {
  return GITHUB_CONFIG.token &&
         GITHUB_CONFIG.owner &&
         GITHUB_CONFIG.repo;
}
