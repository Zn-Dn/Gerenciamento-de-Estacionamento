import { estado } from "./estado.js";
import {
    InputPesquisa, Nome, Telefone, Placa, Tempo,
    entrada, sainda, contador, informacoes
} from "./elementos.js";

const buttonDelete = document.createElement("button")
buttonDelete.textContent = "Deleta"
buttonDelete.addEventListener("click",deletaMotorista)

export function criaDelete(nome:string){
    informacoes?.appendChild(buttonDelete)
estado.motoristaAtual = nome

}


export function limpar(){
    clearInterval(estado.intervalo);
    [Nome,contador,Telefone,entrada,sainda,Tempo,Placa].forEach((el)=>{
        if(el) el.textContent = ""
       
    })
    if(InputPesquisa){
          InputPesquisa.value = ""
    }
  
    estado.motoristaAtual = null
       buttonDelete.remove()
}

async  function deletaMotorista(){
const nome =  estado.motoristaAtual
 if(!nome){
    return;
 }
buttonDelete.disabled = true; 
try{
const resposta = await fetch(`/deletamotorista/${encodeURIComponent(nome)}`,
    {method:"DELETE"}
);
 

const resultado = await resposta.json();
if(!resposta.ok){
    console.log("erro ao comunca com o servidor ")
    return;
}
limpar()

}
catch(erro){
console.log(erro,"erro ao deleta usuario");
}

finally{
    buttonDelete.disabled = false;
}

}