function carregarPagina(pagina) {
  fetch(`pages/${pagina}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
      window.scrollTo(0, 0);
    });
}

// página inicial
carregarPagina("home");
