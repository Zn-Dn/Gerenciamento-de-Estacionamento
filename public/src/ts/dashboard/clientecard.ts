import { estado } from "./estado.js";
import { iniciar, iniciarArraste, pararArraste } from "./arraste.js";

export async function mostraInfor(numero: string | undefined) {

    if (!numero) return;

    try {

        const dadosdoback = await fetch(
            `/dadosCliente/${numero}`
        );

        if (!dadosdoback.ok) {
            console.log("Erro HTTP:", dadosdoback.status);
            return;
        }

        const resultado = await dadosdoback.json();

        mostraInforTela(resultado.informacoes);

    } catch (erro) {

        console.log("Erro na requisição:", erro);

    }
}


interface Cliente {
    nome: string;
    telefone: string;
    entrada: number;
    placa: string;
    modelo: string;
    tempo: number;
}


function calcularHorarioSaida(entrada: number, tempo: number) {

    const saida = entrada + tempo * 60 * 1000;

    const dataSaida = new Date(saida);

    return dataSaida.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}



function mostraInforTela(resultado: Cliente) {
 const horarioSaida = calcularHorarioSaida(resultado.entrada, resultado.tempo);

      const card = document.createElement("div");

   card.addEventListener("mousedown", iniciar);

card.addEventListener("mousemove",(event)=>{
 iniciarArraste(event, card); });


   card.addEventListener("mouseup", pararArraste);



   card.classList.add("card-cliente");

const form = document.createElement("form");
form.classList.add("formulario");

const titulo = document.createElement("h3");
titulo.classList.add("titulo");
titulo.textContent = resultado.nome;

const sainda = document.createElement("p");
sainda.classList.add("saida");
sainda.textContent = `Saida:
${horarioSaida}`;

const telefone = document.createElement("p");
telefone.classList.add("telefone");
telefone.textContent = `Telefone:
${resultado.telefone}`;

const modelo = document.createElement("p");
modelo.classList.add("modelo");
modelo.textContent = `Modelo: ${resultado.modelo}`;

const placa = document.createElement("p");
placa.classList.add("placa");
placa.textContent = `Placa:
${resultado.placa}`;

const fechar = document.createElement("button");
fechar.classList.add("fechar");
fechar.textContent = "X";

fechar.addEventListener("click",()=>{
    card.remove()
    estado.cardAberto = false;
    estado.cardAtual = true
})
   

   
    card.append(fechar,form)
    form.append(
        
        titulo,
        sainda,
        telefone,
        modelo,
        placa
       
    );
     document.querySelector("main")!.appendChild(card);
   

   

return card
}