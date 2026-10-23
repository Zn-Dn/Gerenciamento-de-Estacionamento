import { estado } from "./estado.js";
import {
    InputPesquisa, Nome, Telefone, Placa, Tempo,
    entrada, sainda, contador
} from "./elementos.js";
import { formatarTempo, formatarTelefone } from "./formatacao.js";

export async function enviarReqDeBusca() {

    clearInterval(estado.intervalo);

    const nomeDigitado = InputPesquisa?.value.trim() ?? "";

    if (!nomeDigitado) {
        console.log("Digite um nome para pesquisar.");
        return;
    }

    try {

        const respostaDoBack = await fetch(
            `/encontraMotorista?nomeDoCliente=${encodeURIComponent(nomeDigitado)}`
        );

        if (!respostaDoBack.ok) {

            if (Nome) Nome.textContent = "";
            if (Telefone) Telefone.textContent = "";
            if (Placa) Placa.textContent = "";
            if (Tempo) Tempo.textContent = "";
            if (contador) contador.textContent = "";
            if (entrada) entrada.textContent = "";
            if (sainda) sainda.textContent = "";

            if (respostaDoBack.status === 404) {
                console.log("Motorista não encontrado.");
            } else {
                console.log("Erro no servidor:", respostaDoBack.status);
            }

          return null
        }

        const dados = await respostaDoBack.json();

        const horaEntrada = new Date(dados.entrada);

        const saidaEmMs =
            dados.entrada + dados.tempo

        const horaSaida = new Date(saidaEmMs);

        const formato: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit"
        };

        // estrutura de visualizacao
let telefone = formatarTelefone(dados.telefone);


        if (Nome) Nome.textContent = dados.nome;
        if (Telefone) Telefone.textContent = telefone;
        if (Placa) Placa.textContent = dados.placa;
        if (Tempo) Tempo.textContent = formatarTempo(dados.tempo);

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

                clearInterval(estado.intervalo);
                return;
            }

            const minutos = Math.floor(restante / 60000);

            const segundos = Math.floor(
                (restante % 60000) / 1000
            );

            if (contador) {
                contador.textContent =
                    `${minutos}:${String(segundos).padStart(2, "0")}`;
            }
        }


        atualizarContador();

        estado.intervalo = window.setInterval(
            atualizarContador,
            1000
        );

        return dados;

    } catch (erro) {

        console.error("Erro ao buscar motorista:", erro);

        if (contador) {
            contador.textContent = "Erro na busca";
        }
          return null;
    }
}