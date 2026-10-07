const form = document.getElementById("form");
const input = document.getElementById("input");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const limparBtn = document.getElementById("limpar");
const filtros = document.querySelectorAll(".filtro");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = "todas";

// Salva no localStorage
function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Atualiza o contador
function atualizarContador() {
  const total = tarefas.length;
  const pendentes = tarefas.filter(t => !t.concluida).length;
  contador.innerText = `${pendentes} pendente${pendentes !== 1 ? "s" : ""} de ${total}`;
}

// Renderiza as tarefas
function renderizar() {
  lista.innerHTML = "";

  let filtradas = tarefas;

  if (filtroAtual === "pendentes") {
    filtradas = tarefas.filter(t => !t.concluida);
  } else if (filtroAtual === "concluidas") {
    filtradas = tarefas.filter(t => t.concluida);
  }

  filtradas.forEach((tarefa, index) => {
    const li = document.createElement("li");
    if (tarefa.concluida) li.classList.add("concluida");

    li.innerHTML = `
      <span onclick="alternar(${index})">${tarefa.texto}</span>
      <div class="botoes">
        <button class="btn-check" onclick="alternar(${index})">✓</button>
        <button class="btn-delete" onclick="excluir(${index})">✕</button>
      </div>
    `;
    lista.appendChild(li);
  });

  atualizarContador();
}

// Adiciona nova tarefa
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = input.value.trim();
  if (texto === "") return;

  tarefas.push({ texto, concluida: false });
  input.value = "";
  salvar();
  renderizar();
});

// Marca/desmarca como concluída
function alternar(index) {
  // Ajusta o index real considerando o filtro
  let filtradas = tarefas;
  if (filtroAtual === "pendentes") filtradas = tarefas.filter(t => !t.concluida);
  if (filtroAtual === "concluidas") filtradas = tarefas.filter(t => t.concluida);

  const tarefaReal = filtradas[index];
  const indexReal = tarefas.indexOf(tarefaReal);
  tarefas[indexReal].concluida = !tarefas[indexReal].concluida;
  salvar();
  renderizar();
}

// Exclui tarefa
function excluir(index) {
  let filtradas = tarefas;
  if (filtroAtual === "pendentes") filtradas = tarefas.filter(t => !t.concluida);
  if (filtroAtual === "concluidas") filtradas = tarefas.filter(t => t.concluida);

  const tarefaReal = filtradas[index];
  const indexReal = tarefas.indexOf(tarefaReal);
  tarefas.splice(indexReal, 1);
  salvar();
  renderizar();
}

// Limpar concluídas
limparBtn.addEventListener("click", () => {
  tarefas = tarefas.filter(t => !t.concluida);
  salvar();
  renderizar();
});

// Filtros
filtros.forEach(btn => {
  btn.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    filtroAtual = btn.dataset.filtro;
    renderizar();
  });
});

// Inicia
renderizar();
