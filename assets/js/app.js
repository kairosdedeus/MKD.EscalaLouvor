function carregarPagina(pagina) {
  fetch(`pages/${pagina}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Página não encontrada");
      }
      return response.text();
    })
    .then(html => {
      document.getElementById("content").innerHTML = html;
      window.scrollTo(0, 0);
      window.location.hash = pagina;
    })
    .catch(() => {
      document.getElementById("content").innerHTML = `
        <div class="card">
          <h2>⚠ Página não encontrada</h2>
          <button onclick="carregarPagina('home')">⬅ Voltar</button>
        </div>
      `;
    });
}

// carregar página via URL
function carregarViaHash() {
  const pagina = window.location.hash.replace("#", "");
  if (pagina) {
    carregarPagina(pagina);
  } else {
    carregarPagina("home");
  }
}

// ao abrir o site
carregarViaHash();

// ao mudar o hash (navegação do navegador)
window.addEventListener("hashchange", carregarViaHash);

// página inicial
carregarPagina("home");