let elementoVagasDisponiveis = document.querySelector(".vagas-disponiveis strong")!;
let elementoVagasOcupadas = document.querySelector(".vagas-ocupadas strong")!;
let elementoVagasTotais = document.querySelector(".vagas-totais strong")!;





let buttonCadastra = document.querySelector<HTMLButtonElement>(".cadastra")
console.log("foi")
buttonCadastra?.addEventListener("click",()=>{
   console.log("teste")
    window.location.href = "/src/pages/cadastro.html";
})
let mostra = document.createElement("button")
mostra.innerHTML = `<i class="fa-solid fa-arrows-to-dot"></i>`;
mostra.classList.add("mostra")
let body = document.querySelector<HTMLBodyElement>("body")?.appendChild(mostra)

mostra?.addEventListener("click", () => {
    mostra.style.display = "none"
    Cards?.classList.remove("escondido");
    Opcoes?.classList.remove("escondido");
});

let Focus = document.querySelector<HTMLButtonElement>(".focus")
let Cards = document.querySelector<HTMLSelectElement>(".cards")
let Opcoes = document.querySelector<HTMLSelectElement>(".opcoes")

Focus?.addEventListener("click", () => {
    mostra.style.display = "flex"
    Cards?.classList.toggle("escondido");
    Opcoes?.classList.toggle("escondido");
});

let vagasTotais: number = 60;
let vagasOcupadas: number = 0;
let vagasDisponiveis: number = vagasTotais - vagasOcupadas;


elementoVagasDisponiveis.textContent = String(vagasDisponiveis);
elementoVagasOcupadas.textContent = String(vagasOcupadas);
elementoVagasTotais.textContent = String(vagasTotais);
// estuda para melhor compeecao



async function criarcardsposicao() {
    const posicaoVagas = document.querySelector<HTMLElement>(".posicao-carros");
    if (!posicaoVagas) return;

    const Vagasresposta = await fetch("http://localhost:3000/vagas/ocupadas");
    const verificar = await Vagasresposta.json();
    const ocupadas = new Set<number>(verificar.ocupadas.map((valor:any)=> valor.numero));

// console.log(verificar)
  


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
    }
   return verificar.ocupadas
}

criarcardsposicao();


async function Formata() {
    let contador: number = 0;
    let time = await criarcardsposicao();
console.log(time)
    function verificar() {
        for (contador = 0; contador < time.length; contador++) {

            let sainda = time[contador].entrada + time[contador].tempo * 60 * 1000;
            let resto = sainda - Date.now();
  const LIMITE_PISCAR = 3 * 60 * 1000; 
            let cardvagaalert = document.querySelector(`.cardCarro[data-numero="${time[contador].numero}"]`);

           if (resto <= 0) {
    cardvagaalert?.classList.remove("piscando");
    (cardvagaalert as HTMLElement).style.backgroundColor = "red";
}
else if (resto < LIMITE_PISCAR) {
    cardvagaalert?.classList.add("piscando");
}

let posicao =  time[contador].numero


        }
    }

    verificar();                    
    setInterval(verificar, 1000);   
}

Formata();


async function avisarCliente(numero: number) {
    const resposta = await fetch(`http://localhost:3000/avisar/${numero}`, {
        method: "POST"
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro);   // "Cliente já foi avisado", por exemplo
        return;
    }

    window.open(dados.link, "_blank");   // abre o WhatsApp com a mensagem pronta
}