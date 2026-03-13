async function githubSave(data) {

  await fetch("https://api.github.com/repos/Asa7a2/Dashboard-KA/dispatches", {
    method: "POST",
    headers: {
      "Authorization": "Bearer SEU_TOKEN",
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify({
      event_type: "save_data",
      client_payload: {
        data: data
      }
    })
  });

}
