"use strict";
const InputPesquisa = document.querySelector("#pesquisa input");
const Nome = document.querySelector("#nome");
const Telefone = document.querySelector("#telefone");
const Placa = document.querySelector("#placa");
const Tempo = document.querySelector("#tempo");
const entrada = document.querySelector("#entrada");
const sainda = document.querySelector("#sainda");
const buttonBuscar = document.querySelector("#busca");
const contador = document.querySelector("#contador");
console.log("teste");
let intervalo;
function formatarTempo(tempoEmMs) {
    const h = Math.floor(tempoEmMs / 3600000);
    const m = Math.floor((tempoEmMs % 3600000) / 60000);
    if (h === 0)
        return `${m} min`;
    if (m === 0)
        return `${h}h`;
    return `${h}h ${m}min`;
}
async function enviarReqDeBusca() {
    clearInterval(intervalo);
    const nomeDigitado = InputPesquisa?.value.trim() ?? "";
    if (!nomeDigitado) {
        console.log("Digite um nome para pesquisar.");
        return;
    }
    try {
        const respostaDoBack = await fetch(`/encontraMotorista?nomeDoCliente=${encodeURIComponent(nomeDigitado)}`);
        if (!respostaDoBack.ok) {
            if (Nome)
                Nome.textContent = "";
            if (Telefone)
                Telefone.textContent = "";
            if (Placa)
                Placa.textContent = "";
            if (Tempo)
                Tempo.textContent = "";
            if (contador)
                contador.textContent = "";
            if (entrada)
                entrada.textContent = "";
            if (sainda)
                sainda.textContent = "";
            if (respostaDoBack.status === 404) {
                console.log("Motorista não encontrado.");
            }
            else {
                console.log("Erro no servidor:", respostaDoBack.status);
            }
            return;
        }
        const dados = await respostaDoBack.json();
        const horaEntrada = new Date(dados.entrada);
        const saidaEmMs = dados.entrada + dados.tempo;
        const horaSaida = new Date(saidaEmMs);
        const formato = {
            hour: "2-digit",
            minute: "2-digit"
        };
        if (Nome)
            Nome.textContent = dados.nome;
        if (Telefone)
            Telefone.textContent = dados.telefone;
        if (Placa)
            Placa.textContent = dados.placa;
        if (Tempo)
            Tempo.textContent = formatarTempo(dados.tempo);
        if (entrada) {
            entrada.textContent =
                horaEntrada.toLocaleTimeString("pt-BR", formato);
        }
        // sainda esta errando ela deve ser somada com o tempo 
        if (sainda) {
            sainda.textContent =
                horaSaida.toLocaleTimeString("pt-BR", formato);
        }
        function atualizarContador() {
            const restante = saidaEmMs - Date.now();
            if (restante <= 0) {
                if (contador) {
                    contador.textContent = "Tempo esgotado";
                }
                clearInterval(intervalo);
                return;
            }
            const minutos = Math.floor(restante / 60000);
            const segundos = Math.floor((restante % 60000) / 1000);
            if (contador) {
                contador.textContent =
                    `${minutos}:${String(segundos).padStart(2, "0")}`;
            }
        }
        atualizarContador();
        intervalo = window.setInterval(atualizarContador, 1000);
    }
    catch (erro) {
        console.error("Erro ao buscar motorista:", erro);
        if (contador) {
            contador.textContent = "Erro na busca";
        }
    }
}
buttonBuscar?.addEventListener("click", () => {
    enviarReqDeBusca();
});
