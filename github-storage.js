// ═══════════════════════════════════════════════
// GITHUB STORAGE - CONFIGURAÇÃO
// ═══════════════════════════════════════════════

const GITHUB_CONFIG = {
  owner: "Asa7a2",
  repo: "Dashboard-KA",
  token: "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"
};


// ═══════════════════════════════════════════════
// CARREGAR DADOS DO GITHUB
// ═══════════════════════════════════════════════

async function githubLoad() {

  try {

    const url =
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/data/dados.json`;

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${GITHUB_CONFIG.token}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      console.log("Arquivo ainda não existe.");
      return null;
    }

    const json = await res.json();

    const content = atob(json.content.replace(/\n/g, ""));

    return JSON.parse(content);

  } catch (e) {

    console.error("Erro ao carregar do GitHub:", e);

    return null;
  }

}



// ═══════════════════════════════════════════════
// SALVAR DADOS USANDO GITHUB ACTION
// ═══════════════════════════════════════════════

async function githubSave(data) {

  try {

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/dispatches`,
      {
        method: "POST",

        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${GITHUB_CONFIG.token}`
        },

        body: JSON.stringify({
          event_type: "save_data",
          client_payload: {
            data: JSON.stringify(data)
          }
        })
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao acionar workflow");
    }

    console.log("Workflow acionado");

    return true;

  } catch (e) {

    console.error("Erro ao salvar:", e);

    return false;
  }

}



// ═══════════════════════════════════════════════
// VERIFICAR CONFIGURAÇÃO
// ═══════════════════════════════════════════════

function githubConfigValid() {
  return (
    GITHUB_CONFIG.token &&
    GITHUB_CONFIG.owner &&
    GITHUB_CONFIG.repo
  );
}
