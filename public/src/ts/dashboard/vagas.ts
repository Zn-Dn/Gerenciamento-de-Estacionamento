import { estado } from "./estado";
import { mostraInfor } from "./clientecard";

let elementoVagasDisponiveis = document.querySelector(".vagas-disponiveis strong")!;
let elementoVagasOcupadas = document.querySelector(".vagas-ocupadas strong")!;
let elementoVagasTotais = document.querySelector(".vagas-totais strong")!;

let vagasTotais: number = 60;
let vagasOcupadas: number = 0;
let vagasDisponiveis: number = vagasTotais - vagasOcupadas;


elementoVagasDisponiveis.textContent = String(vagasDisponiveis);
elementoVagasOcupadas.textContent = String(vagasOcupadas);
elementoVagasTotais.textContent = String(vagasTotais);
// estuda para melhor compreecao

export async function criarcardsposicao() {
    const posicaoVagas = document.querySelector<HTMLElement>(".posicao-carros");
    if (!posicaoVagas) return;

    const Vagasresposta = await fetch("/vagas/ocupadas");
    const verificar = await Vagasresposta.json();
    const ocupadas = new Set<number>(verificar.ocupadas.map((valor:any)=> valor.numero));


  


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

  
        cardPosicao.addEventListener("click",()=>{

           
 const numero = cardPosicao.dataset.numero;


if(estado.cardAberto){
    return
}
else{
  estado.cardAberto = true;
  mostraInfor(numero);   
}
   
        })
    }
   return verificar.ocupadas
}