const MES_ATUAL = "2026-01";

function carregarPorHash() {
  const hash = window.location.hash.replace("#", "");

  if (hash.startsWith("equipes/")) {
    const equipe = hash.split("/")[1].toUpperCase();
    carregarEquipe(equipe);
  } else {
    carregarHome();
  }
}

window.addEventListener("hashchange", carregarPorHash);
carregarPorHash();

async function carregarHome() {
  const html = await fetch("pages/home.html").then((r) => r.text());
  document.getElementById("content").innerHTML = html;

  await carregarEquipesHome();
  await carregarCantoresHome();

  window.scrollTo(0, 0);
}

async function carregarEquipesHome() {
  const { data, error } = await supabaseClient
    .from("equipes")
    .select("codigo")
    .order("codigo");

  const ul = document.getElementById("lista-equipes");
  ul.innerHTML = "";

  if (error) {
    ul.innerHTML = "<li>Erro ao carregar equipes</li>";
    return;
  }

  data.forEach((equipe) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="#equipes/${equipe.codigo.toLowerCase()}">
        Equipe ${equipe.codigo}
      </a>
    `;
    ul.appendChild(li);
  });
}

async function carregarCantoresHome() {
  const { data, error } = await supabaseClient.from("equipes_integrantes")
    .select(`
      pessoas ( nome ),
      equipes ( codigo )
    `);

  const tbody = document.getElementById("tabela-cantores");
  tbody.innerHTML = "";

  if (error) {
    tbody.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados</td></tr>";
    console.error(error);
    return;
  }

  const mapa = {};

  data.forEach((item) => {
    const nome = item.pessoas.nome;
    const equipe = normalizarEquipe(item.equipes.codigo);

    if (!mapa[nome]) mapa[nome] = new Set();
    mapa[nome].add(equipe);
  });

  Object.keys(mapa)
    .sort()
    .forEach((nome) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${nome}</td>
        <td>${Array.from(mapa[nome]).sort().join(" / ")}</td>
      `;

      tbody.appendChild(tr);
    });
}

async function carregarEquipe(codigoEquipe) {
  const { data: equipeData, error: equipeError } = await supabaseClient
    .from("equipes")
    .select("id")
    .eq("codigo", codigoEquipe)
    .single();

  if (equipeError) {
    console.error("Erro ao buscar equipe:", equipeError);
    document.getElementById("content").innerHTML = "<p>Equipe não encontrada</p>";
    return;
  }
const equipeId = equipeData.id;

  // Passo 2: Buscar os integrantes dessa equipe
  const { data: integrantes, error: integrantesError } = await supabaseClient
    .from("equipes_integrantes")
    .select(`
      pessoas ( nome ),
      equipes ( codigo ),
      funcoes ( nome )
    `)
    .eq("equipe_id", equipeId); 

    if (integrantesError) {
    console.error("Erro ao carregar integrantes:", integrantesError);
    document.getElementById("content").innerHTML = "<p>Erro ao carregar os integrantes da equipe</p>";
    return;
  }

  // Passo 3: Renderizar
  renderEquipe(codigoEquipe, integrantes);
 
}

function renderEquipe(codigo, dados) {
  let html = `<div class="card"><h2>Equipe ${codigo}</h2>`;

  const ministros = dados.filter((d) => d.funcoes.nome === "Ministro");
  const backs = dados.filter((d) => d.funcoes.nome === "Back");

  html += "<h3>Ministros</h3><ul>";
  ministros.forEach((m) => (html += `<li>${m.pessoas.nome}</li>`));
  html += "</ul>";

  html += "<h3>Backs</h3><ul>";
  backs.forEach((b) => (html += `<li>${b.pessoas.nome}</li>`));
  html += "</ul>";

  html += `<button onclick="window.location.hash=''">Voltar</button></div>`;

  document.getElementById("content").innerHTML = html;
}

function normalizarEquipe(codigo) {
  return codigo.charAt(0).toUpperCase();
}
