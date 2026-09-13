let elementoVagasDisponiveis = document.querySelector(".vagas-disponiveis strong")!;
let elementoVagasOcupadas = document.querySelector(".vagas-ocupadas strong")!;
let elementoVagasTotais = document.querySelector(".vagas-totais strong")!;

let vagasTotais: number = 60;
let vagasOcupadas: number = 14;
let vagasDisponiveis: number = vagasTotais - vagasOcupadas;


elementoVagasDisponiveis.textContent = String(vagasDisponiveis);
elementoVagasOcupadas.textContent = String(vagasOcupadas);
elementoVagasTotais.textContent = String(vagasTotais);



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

function criarcardsposicao(){
   let quantidadeVagas:number = 60
   let posicaoVagas = document.querySelector<HTMLSelectElement>(".posicao-carros")
const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for(let i = 1;i<=quantidadeVagas;i++){
    const grupo = Math.floor((i - 1) / 10);
const letra = letras[grupo];
let posicao = `${letra}${i}`

let cardPosicao = document.createElement("div")
cardPosicao.classList.add("cardCarro")
cardPosicao.innerText = String(posicao)
posicaoVagas?.appendChild(cardPosicao)
} 


}

criarcardsposicao()



