"use strict";
let elementoVagasDisponiveis = document.querySelector(".vagas-disponiveis strong");
let elementoVagasOcupadas = document.querySelector(".vagas-ocupadas strong");
let elementoVagasTotais = document.querySelector(".vagas-totais strong");
const buttonCadastra = document.querySelector(".cadastra");
const buscar = document.querySelector("#buscar");
// console.log("foi")
buttonCadastra?.addEventListener("click", () => {
    window.location.href = "/src/pages/cadastro.html";
});
buscar?.addEventListener("click", () => {
    window.location.href = "/src/pages/motorista.html";
});
let mostra = document.createElement("button");
mostra.innerHTML = `<i class="fa-solid fa-arrows-to-dot"></i>`;
mostra.classList.add("mostra");
let body = document.querySelector("body")?.appendChild(mostra);
mostra?.addEventListener("click", () => {
    mostra.style.display = "none";
    Cards?.classList.remove("escondido");
    Opcoes?.classList.remove("escondido");
});
let Focus = document.querySelector(".focus");
let Cards = document.querySelector(".cards");
let Opcoes = document.querySelector(".opcoes");
Focus?.addEventListener("click", () => {
    mostra.style.display = "flex";
    Cards?.classList.toggle("escondido");
    Opcoes?.classList.toggle("escondido");
});
let vagasTotais = 60;
let vagasOcupadas = 0;
let vagasDisponiveis = vagasTotais - vagasOcupadas;
elementoVagasDisponiveis.textContent = String(vagasDisponiveis);
elementoVagasOcupadas.textContent = String(vagasOcupadas);
elementoVagasTotais.textContent = String(vagasTotais);
// estuda para melhor compreecao
async function criarcardsposicao() {
    const posicaoVagas = document.querySelector(".posicao-carros");
    if (!posicaoVagas)
        return;
    const Vagasresposta = await fetch("http://localhost:3000/vagas/ocupadas");
    const verificar = await Vagasresposta.json();
    const ocupadas = new Set(verificar.ocupadas.map((valor) => valor.numero));
    elementoVagasOcupadas.textContent = String(ocupadas.size);
    elementoVagasDisponiveis.textContent = String(vagasTotais - ocupadas.size);
    posicaoVagas.innerHTML = "";
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 1; i <= vagasTotais; i++) {
        const grupo = Math.floor((i - 1) / 10);
        const letra = letras[grupo];
        const cardPosicao = document.createElement("div");
        cardPosicao.classList.add("cardCarro");
        cardPosicao.innerText = `${letra}${i}`;
        if (ocupadas.has(i)) {
            cardPosicao.style.backgroundColor = "#22C55E";
        }
        posicaoVagas.appendChild(cardPosicao);
        cardPosicao.dataset.numero = String(i);
        cardPosicao.addEventListener("click", () => {
            const numero = cardPosicao.dataset.numero;
            mostraInfor(numero);
        });
    }
    return verificar.ocupadas;
}
criarcardsposicao();
async function mostraInfor(numero) {
    if (!numero)
        return;
    try {
        const dadosdoback = await fetch(`http://localhost:3000/dadosCliente/${numero}`);
        if (!dadosdoback.ok) {
            console.log("Erro HTTP:", dadosdoback.status);
            return;
        }
        const resultado = await dadosdoback.json();
        mostraInforTela(resultado.informacoes);
    }
    catch (erro) {
        console.log("Erro na requisição:", erro);
    }
}
let cardAtual = true;
function mostraInforTela(resultado) {
    const card = document.createElement("div");
    card.addEventListener("mousedown", iniciar);
    card.addEventListener("mousemove", (event) => {
        iniciarArraste(event, card);
    });
    card.addEventListener("mouseup", pararArraste);
    card.classList.add("card-cliente");
    const form = document.createElement("form");
    const titulo = document.createElement("h3");
    titulo.classList.add("titulo");
    titulo.textContent = resultado.nome;
    const nome = document.createElement("p");
    nome.textContent = resultado.nome;
    const telefone = document.createElement("p");
    telefone.textContent = resultado.telefone;
    const modelo = document.createElement("p");
    modelo.textContent = resultado.modelo;
    const placa = document.createElement("p");
    placa.textContent = resultado.placa;
    const fechar = document.createElement("button");
    fechar.textContent = "X";
    fechar.addEventListener("click", () => {
        card.remove();
        cardAtual = true;
    });
    card.append(form);
    form.append(fechar, titulo, nome, telefone, modelo, placa);
    document.querySelector("main").appendChild(card);
    return card;
}
// button de click de ambas funcoes,pega a posicao inicial,inicia como true soma com o arraste
let estadoDeAcao = true;
function iniciar() {
    estadoDeAcao = true;
}
function iniciarArraste(event, card) {
    if (estadoDeAcao) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const valorcardX = card.offsetLeft + card.offsetWidth / 2;
        ;
        const valorcardY = card.offsetTop + card.offsetHeight / 2;
        ;
        const distanciaX = mouseX - valorcardX;
        const distanciaY = mouseY - valorcardY;
        card.style.transform = `translate(${distanciaX}px, ${distanciaY}px)`;
    }
}
function pararArraste() {
    estadoDeAcao = false;
}
async function Formata() {
    let contador = 0;
    let time = await criarcardsposicao();
    console.log(time);
    function verificar() {
        for (contador = 0; contador < time.length; contador++) {
            let sainda = time[contador].entrada + time[contador].tempo * 60 * 1000;
            let resto = sainda - Date.now();
            const LIMITE_PISCAR = 3 * 60 * 1000;
            let cardvagaalert = document.querySelector(`.cardCarro[data-numero="${time[contador].numero}"]`);
            if (resto <= 0) {
                cardvagaalert?.classList.remove("piscando");
                cardvagaalert.style.backgroundColor = "red";
            }
            else if (resto < LIMITE_PISCAR) {
                cardvagaalert?.classList.add("piscando");
            }
        }
    }
    verificar();
    setInterval(verificar, 1000);
}
Formata();
async function avisarCliente(numero) {
    const resposta = await fetch(`http://localhost:3000/avisar/${numero}`, {
        method: "POST"
    });
    const dados = await resposta.json();
    if (!resposta.ok) {
        alert(dados.erro);
        return;
    }
    window.open(dados.link, "_blank"); // abre o WhatsApp com a mensagem pronta
}
