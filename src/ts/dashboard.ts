const elementoVagasDisponiveis = document.querySelector(".vagas-disponiveis strong")!;
const elementoVagasOcupadas = document.querySelector(".vagas-ocupadas strong")!;
const elementoVagasTotais = document.querySelector(".vagas-totais strong")!;

const buttonCadastra = document.querySelector<HTMLButtonElement>(".cadastra");
const buscar = document.querySelector<HTMLButtonElement>("#buscar");

// CORREÇÃO: Cards e Opcoes não são <select>, são elementos genéricos (HTMLElement).
// Também foram movidos para antes dos listeners que os usam.
const Focus = document.querySelector<HTMLButtonElement>(".focus");
const Cards = document.querySelector<HTMLElement>(".cards");
const Opcoes = document.querySelector<HTMLElement>(".opcoes");

const mostra = document.createElement("button");
mostra.innerHTML = `<i class="fa-solid fa-arrows-to-dot"></i>`;
mostra.classList.add("mostra");
// CORREÇÃO: a variável "body" guardava o retorno do appendChild e nunca era usada.
document.body.appendChild(mostra);

mostra.addEventListener("click", () => {
    mostra.style.display = "none";
    Cards?.classList.remove("escondido");
    Opcoes?.classList.remove("escondido");
});

Focus?.addEventListener("click", () => {
    mostra.style.display = "flex";
    // CORREÇÃO: toggle podia mostrar o botão "mostra" com os cards ainda visíveis.
    Cards?.classList.add("escondido");
    Opcoes?.classList.add("escondido");
});

const vagasTotais: number = 60;
const vagasOcupadas: number = 0;
const vagasDisponiveis: number = vagasTotais - vagasOcupadas;

elementoVagasDisponiveis.textContent = String(vagasDisponiveis);
elementoVagasOcupadas.textContent = String(vagasOcupadas);
elementoVagasTotais.textContent = String(vagasTotais);
// estuda para melhor compreecao

// Formato de cada vaga ocupada que o backend devolve em /vagas/ocupadas
interface VagaOcupada {
    numero: number;
    entrada: number;
    tempo: number;
}

interface Cliente {
    nome: string;
    telefone: string;
    entrada: number;
    placa: string;
    modelo: string;
    tempo: number;
}

let cardAberto: boolean = false;

// CORREÇÃO: agora SEMPRE devolve uma lista (antes devolvia undefined em alguns
// caminhos, o que quebrava a função Formata com "Cannot read properties of undefined").
async function criarcardsposicao(): Promise<VagaOcupada[]> {
    const posicaoVagas = document.querySelector<HTMLElement>(".posicao-carros");
    if (!posicaoVagas) return [];

    try {
        const Vagasresposta = await fetch("/vagas/ocupadas");

        // CORREÇÃO: faltava verificar se a resposta foi bem-sucedida.
        if (!Vagasresposta.ok) {
            console.log("Erro HTTP:", Vagasresposta.status);
            return [];
        }

        const verificar = await Vagasresposta.json();
        const listaOcupadas: VagaOcupada[] = verificar.ocupadas;
        // CORREÇÃO: Number() garante que "5" (texto) e 5 (número) sejam comparados igual.
        const ocupadas = new Set<number>(listaOcupadas.map((valor) => Number(valor.numero)));

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
            cardPosicao.dataset.numero = String(i);

            if (ocupadas.has(i)) {
                cardPosicao.style.backgroundColor = "#22C55E";
            }

            cardPosicao.addEventListener("click", () => {
                const numero = cardPosicao.dataset.numero;

                if (cardAberto) {
                    return;
                }
                cardAberto = true;
                mostraInfor(numero);
            });

            posicaoVagas.appendChild(cardPosicao);
        }

        return listaOcupadas;
    } catch (erro) {
        // CORREÇÃO: antes, se o servidor estivesse fora do ar, o erro ficava sem tratamento.
        console.log("Erro na requisição:", erro);
        return [];
    }
}

// CORREÇÃO: removida a chamada solta "criarcardsposicao();" daqui.
// A função Formata() (mais abaixo) já chama criarcardsposicao(), então a página
// fazia o mesmo fetch duas vezes e montava os cards duas vezes.

async function mostraInfor(numero: string | undefined) {
    if (!numero) {
        cardAberto = false;
        return;
    }

    try {
        const dadosdoback = await fetch(`/dadosCliente/${numero}`);

        if (!dadosdoback.ok) {
            console.log("Erro HTTP:", dadosdoback.status);
            // CORREÇÃO: sem isto, cardAberto ficava true para sempre e nenhuma vaga
            // podia mais ser clicada depois de um erro.
            cardAberto = false;
            return;
        }

        const resultado = await dadosdoback.json();

        mostraInforTela(resultado.informacoes);
        // CORREÇÃO: removida a chamada calcularhoraeminutos(...) que ficava aqui,
        // pois o retorno era descartado (mostraInforTela já calcula o horário).
    } catch (erro) {
        console.log("Erro na requisição:", erro);
        cardAberto = false; // CORREÇÃO: mesmo motivo acima.
    }
}

function calcularhoraeminutos(entrada: number, tempo: number) {
    // "tempo" já vem em MILISSEGUNDOS (o cadastro converte horas/minutos antes de salvar),
    // então somar direto na entrada está certo.
    const saida = entrada + tempo;
    const data = new Date(saida);

    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function mostraInforTela(resultado: Cliente) {
    const horarioSaida = calcularhoraeminutos(resultado.entrada, resultado.tempo);

    const card = document.createElement("div");

    // CORREÇÃO: mousemove e mouseup agora ficam no document (e não no card).
    // Antes, se o mouse saísse de cima do card (ou se soltasse o botão fora dele),
    // estadoDeAcao ficava true e o card "grudava" no mouse.
    const aoArrastar = (event: MouseEvent) => {
        iniciarArraste(event, card);
    };

    card.addEventListener("mousedown", iniciar);
    document.addEventListener("mousemove", aoArrastar);
    document.addEventListener("mouseup", pararArraste);

    card.classList.add("card-cliente");
    const form = document.createElement("form");
    form.classList.add("formulario");

    const titulo = document.createElement("h3");
    titulo.classList.add("titulo");
    titulo.textContent = resultado.nome;

    const saida = document.createElement("p");
    saida.textContent = `Saída: ${horarioSaida}`; // CORREÇÃO: "Sainda" -> "Saída"

    const telefone = document.createElement("p");
    telefone.textContent = `Telefone: ${resultado.telefone}`;

    const modelo = document.createElement("p");
    modelo.textContent = `Modelo: ${resultado.modelo}`;

    const placa = document.createElement("p");
    placa.textContent = `Placa: ${resultado.placa}`;

    const fechar = document.createElement("button");
    fechar.textContent = "X";
    fechar.classList.add("fechar");

    fechar.addEventListener("click", () => {
        // CORREÇÃO: remove os listeners do document, senão cada card aberto
        // deixaria listeners "esquecidos" na página (vazamento de memória).
        document.removeEventListener("mousemove", aoArrastar);
        document.removeEventListener("mouseup", pararArraste);
        card.remove();
        cardAberto = false;
        // CORREÇÃO: removida a variável "cardAtual", que nunca era lida.
    });

    card.append(fechar, form);
    form.append(titulo, saida, telefone, modelo, placa);
    document.querySelector("main")!.appendChild(card);

    return card;
}

// button de click de ambas funcoes,pega a posicao inicial,inicia como true soma com o arraste

let estadoDeAcao = false;

function iniciar() {
    estadoDeAcao = true;
}

function iniciarArraste(event: MouseEvent, card: HTMLElement) {
    if (estadoDeAcao) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // offsetleft e top dizem onde o card está
        //offsetwidth e offsetHeight   dizem o tamanho dele.

        const valorcardX = card.offsetLeft + card.offsetWidth / 2;
        const valorcardY = card.offsetTop + card.offsetHeight / 2;

        const distanciaX = mouseX - valorcardX;
        const distanciaY = mouseY - valorcardY;

        card.style.transform = `translate(${distanciaX}px, ${distanciaY}px)`;
    }
}

function pararArraste() {
    estadoDeAcao = false;
}

async function Formata() {
    const time = await criarcardsposicao();
    // CORREÇÃO: constante movida para fora do loop (não precisa ser recriada a cada volta).
    const LIMITE_PISCAR = 3 * 60 * 1000;

    function verificar() {
        // CORREÇÃO: "contador" agora é local do for (antes era declarado fora sem necessidade).
        for (let contador = 0; contador < time.length; contador++) {
            // CORREÇÃO: "tempo" já está em milissegundos. O "* 60 * 1000" que existia aqui
            // multiplicava o tempo por 60 mil, então o alerta de vaga vencida nunca disparava.
            const saida = time[contador].entrada + time[contador].tempo;
            const resto = saida - Date.now();
            const cardvagaalert = document.querySelector<HTMLElement>(
                `.cardCarro[data-numero="${time[contador].numero}"]`
            );

            // CORREÇÃO: se o card não existir, antes dava erro em "(cardvagaalert as HTMLElement).style".
            if (!cardvagaalert) continue;

            if (resto <= 0) {
                cardvagaalert.classList.remove("piscando");
                cardvagaalert.style.backgroundColor = "red";
            } else if (resto < LIMITE_PISCAR) {
                cardvagaalert.classList.add("piscando");
            }
        }
    }

    verificar();
    setInterval(verificar, 1000);
}

Formata();

async function avisarCliente(numero: number) {
    const resposta = await fetch(`/avisar/${numero}`, {
        method: "POST",
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro);
        return;
    }

    window.open(dados.link, "_blank");
}

buttonCadastra?.addEventListener("click", () => {
    window.location.href = "/cadastro.html";
});

buscar?.addEventListener("click", () => {
    window.location.href = "/motorista.html";
});