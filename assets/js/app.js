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

