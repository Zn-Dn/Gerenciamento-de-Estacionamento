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
const informacoes = document.querySelector("#informacoes");
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
function formatarTelefone(telefone) {
    if (telefone.length < 11) {
        return ("valor nao correspode");
    }
    const numeros = telefone.replace(/\D/g, "");
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
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
            return null;
        }
        const dados = await respostaDoBack.json();
        const horaEntrada = new Date(dados.entrada);
        const saidaEmMs = dados.entrada + dados.tempo;
        const horaSaida = new Date(saidaEmMs);
        const formato = {
            hour: "2-digit",
            minute: "2-digit"
        };
        // estrutura de visualizacao
        let telefone = formatarTelefone(dados.telefone);
        if (Nome)
            Nome.textContent = dados.nome;
        if (Telefone)
            Telefone.textContent = telefone;
        if (Placa)
            Placa.textContent = dados.placa;
        if (Tempo)
            Tempo.textContent = formatarTempo(dados.tempo);
        if (entrada) {
            entrada.textContent =
                horaEntrada.toLocaleTimeString("pt-BR", formato);
        }
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
        return dados;
    }
    catch (erro) {
        console.error("Erro ao buscar motorista:", erro);
        if (contador) {
            contador.textContent = "Erro na busca";
        }
        return null;
    }
}
let motoristaAtual = null;
const buttonDelete = document.createElement("button");
buttonDelete.textContent = "Deleta";
buttonDelete.addEventListener("click", deletaMotorista);
function criaDelete(nome) {
    informacoes?.appendChild(buttonDelete);
    motoristaAtual = nome;
}
function limpar() {
    clearInterval(intervalo);
    [Nome, contador, Telefone, entrada, sainda, Tempo, Placa].forEach((el) => {
        if (el)
            el.textContent = "";
    });
    motoristaAtual = null;
    buttonDelete.remove();
}
async function deletaMotorista() {
    const nome = motoristaAtual;
    if (!nome) {
        return;
    }
    buttonDelete.disabled = true;
    try {
        const resposta = await fetch(`/deletamotorista/${encodeURIComponent(nome)}`, { method: "DELETE" });
        const resultado = await resposta.json();
        if (!resposta.ok) {
            console.log("erro ao comunca com o servidor ");
            return;
        }
        limpar();
    }
    catch (erro) {
        console.log(erro, "erro ao deleta usuario");
    }
    finally {
        buttonDelete.disabled = false;
    }
}
buttonBuscar?.addEventListener("click", async () => {
    const dados = await enviarReqDeBusca();
    if (dados?.nome) {
        criaDelete(dados.nome);
    }
    else {
        limpar();
    }
});
