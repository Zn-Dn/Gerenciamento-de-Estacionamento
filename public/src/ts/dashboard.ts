// let elementoVagasDisponiveis = document.querySelector(".vagas-disponiveis strong")!;
// let elementoVagasOcupadas = document.querySelector(".vagas-ocupadas strong")!;
// let elementoVagasTotais = document.querySelector(".vagas-totais strong")!;


// const buttonCadastra = document.querySelector<HTMLButtonElement>(".cadastra")
//  const buscar = document.querySelector<HTMLButtonElement>("#buscar")



// let mostra = document.createElement("button")
// mostra.innerHTML = `<i class="fa-solid fa-arrows-to-dot"></i>`;
// mostra.classList.add("mostra")
// let body = document.querySelector<HTMLBodyElement>("body")?.appendChild(mostra)

// mostra?.addEventListener("click", () => {
//     mostra.style.display = "none"
//     Cards?.classList.remove("escondido");
//     Opcoes?.classList.remove("escondido");
// });

// let Focus = document.querySelector<HTMLButtonElement>(".focus")
// let Cards = document.querySelector<HTMLSelectElement>(".cards")
// let Opcoes = document.querySelector<HTMLSelectElement>(".opcoes")

// Focus?.addEventListener("click", () => {
//     mostra.style.display = "flex"
//     Cards?.classList.toggle("escondido");
//     Opcoes?.classList.toggle("escondido");
// });

// let vagasTotais: number = 60;
// let vagasOcupadas: number = 0;
// let vagasDisponiveis: number = vagasTotais - vagasOcupadas;


// elementoVagasDisponiveis.textContent = String(vagasDisponiveis);
// elementoVagasOcupadas.textContent = String(vagasOcupadas);
// elementoVagasTotais.textContent = String(vagasTotais);
// // estuda para melhor compreecao

// let cardAberto: boolean = false;

// async function criarcardsposicao() {
//     const posicaoVagas = document.querySelector<HTMLElement>(".posicao-carros");
//     if (!posicaoVagas) return;

//     const Vagasresposta = await fetch("/vagas/ocupadas");
//     const verificar = await Vagasresposta.json();
//     const ocupadas = new Set<number>(verificar.ocupadas.map((valor:any)=> valor.numero));


  


//     elementoVagasOcupadas.textContent = String(ocupadas.size);
//     elementoVagasDisponiveis.textContent = String(vagasTotais - ocupadas.size);


   
//     posicaoVagas.innerHTML = "";
//     const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

//     for (let i = 1; i <= vagasTotais; i++) {
//         const grupo = Math.floor((i - 1) / 10);
//         const letra = letras[grupo];

//         const cardPosicao = document.createElement("div");
//         cardPosicao.classList.add("cardCarro");
//         cardPosicao.innerText = `${letra}${i}`;

       
//         if (ocupadas.has(i)) {
//             cardPosicao.style.backgroundColor = "#22C55E";
//         }

//         posicaoVagas.appendChild(cardPosicao);

//         cardPosicao.dataset.numero = String(i);

  
//         cardPosicao.addEventListener("click",()=>{

           
//  const numero = cardPosicao.dataset.numero;


// if(cardAberto){
//     return
// }
// else{
//   cardAberto = true;
//   mostraInfor(numero);   
// }
   
//         })
//     }
//    return verificar.ocupadas
// }

// criarcardsposicao();



// async function mostraInfor(numero: string | undefined) {

//     if (!numero) return;

//     try {

//         const dadosdoback = await fetch(
//             `/dadosCliente/${numero}`
//         );

//         if (!dadosdoback.ok) {
//             console.log("Erro HTTP:", dadosdoback.status);
//             return;
//         }

//         const resultado = await dadosdoback.json();

//         mostraInforTela(resultado.informacoes);

//     } catch (erro) {

//         console.log("Erro na requisição:", erro);

//     }
// }


// interface Cliente {
//     nome: string;
//     telefone: string;
//     entrada: number;
//     placa: string;
//     modelo: string;
//     tempo: number;
// }
// let cardAtual = true


// function calcularHorarioSaida(entrada: number, tempo: number) {

//     const saida = entrada + tempo * 60 * 1000;

//     const dataSaida = new Date(saida);

//     return dataSaida.toLocaleTimeString("pt-BR", {
//         hour: "2-digit",
//         minute: "2-digit"
//     });
// }



// function mostraInforTela(resultado: Cliente) {
//  const horarioSaida = calcularHorarioSaida(resultado.entrada, resultado.tempo);

//       const card = document.createElement("div");

//    card.addEventListener("mousedown", iniciar);

// card.addEventListener("mousemove",(event)=>{
//  iniciarArraste(event, card); });


//    card.addEventListener("mouseup", pararArraste);



//    card.classList.add("card-cliente");

// const form = document.createElement("form");
// form.classList.add("formulario");

// const titulo = document.createElement("h3");
// titulo.classList.add("titulo");
// titulo.textContent = resultado.nome;

// const sainda = document.createElement("p");
// sainda.classList.add("saida");
// sainda.textContent = `Saida:
// ${horarioSaida}`;

// const telefone = document.createElement("p");
// telefone.classList.add("telefone");
// telefone.textContent = `Telefone:
// ${resultado.telefone}`;

// const modelo = document.createElement("p");
// modelo.classList.add("modelo");
// modelo.textContent = `Modelo: ${resultado.modelo}`;

// const placa = document.createElement("p");
// placa.classList.add("placa");
// placa.textContent = `Placa:
// ${resultado.placa}`;

// const fechar = document.createElement("button");
// fechar.classList.add("fechar");
// fechar.textContent = "X";

// fechar.addEventListener("click",()=>{
//     card.remove()
//     cardAberto = false;
//     cardAtual = true
// })
   

   
//     card.append(fechar,form)
//     form.append(
        
//         titulo,
//         sainda,
//         telefone,
//         modelo,
//         placa
       
//     );
//      document.querySelector("main")!.appendChild(card);
   

   

// return card
// }




// let estadoDeAcao = false;

// function iniciar() {

//         estadoDeAcao = true; 
//     }



// function iniciarArraste(event: MouseEvent, card: HTMLElement) {
//     if(estadoDeAcao){

    
// const mouseX  = event.clientX;
// const mouseY  = event.clientY;



// const valorcardX = card.offsetLeft + card.offsetWidth /2; ;
// const valorcardY = card.offsetTop + card.offsetHeight /2;;

// const distanciaX = mouseX - valorcardX;
// const distanciaY = mouseY - valorcardY;

// card.style.transform = `translate(${distanciaX}px, ${distanciaY}px)`;
// }}


// function pararArraste() {
//     estadoDeAcao = false;
// }

//    function calcularSaida(entrada: number, tempo: number): number {
//     return entrada + tempo * 60 * 1000;
// }
 
// async function Formata() {
//     let contador: number = 0;
//     let time = await criarcardsposicao();

//     function verificar() {
//         for (contador = 0; contador < time.length; contador++) {

//             const saida = calcularSaida(
//     time[contador].entrada,
//     time[contador].tempo
// );

// const resto = saida - Date.now();
//   const LIMITE_PISCAR = 3 * 60 * 1000; 
//             let cardvagaalert = document.querySelector(`.cardCarro[data-numero="${time[contador].numero}"]`);

//            if (resto <= 0) {
//     cardvagaalert?.classList.remove("piscando");
//     (cardvagaalert as HTMLElement).style.backgroundColor = "red";
// }
// else if (resto < LIMITE_PISCAR) {
//     cardvagaalert?.classList.add("piscando");
// }




//         }
//     }

//     verificar();                    
//     setInterval(verificar, 1000);   
// }

// Formata();


// async function avisarCliente(numero: number) {
//     const resposta = await fetch(`/avisar/${numero}`, {
//         method: "POST"
//     });
//     const dados = await resposta.json();

//     if (!resposta.ok) {
//         alert(dados.erro);   
//         return;
//     }

//     window.open(dados.link, "_blank");   

// }


// buttonCadastra?.addEventListener("click",()=>{
  
//     window.location.href = "/cadastro.html";
// })

// buscar?.addEventListener("click",()=>{
  
//     window.location.href = "/motorista.html";
// })
