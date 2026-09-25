let nomeInput = document.querySelector<HTMLInputElement>("#nome")!
let cpfInput = document.querySelector<HTMLInputElement>("#cpf")!
let telefoneInput = document.querySelector<HTMLInputElement>("#telefone")!
let tempoInput = document.querySelector<HTMLInputElement>("#tempo")!
let select = document.querySelector<HTMLSelectElement>("#escolharTempo select")!;

// Carro
let placa = document.querySelector<HTMLInputElement>("#placa")!
let modelo = document.querySelector<HTMLInputElement>("#modelo")!
let cor = document.querySelector<HTMLInputElement>("#cor")!


let button = document.querySelector<HTMLButtonElement>("#buttoncadastro")

// const testeCpf = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
// const testeTelefone = /^\(\d{2}\) \d{5}-\d{4}$/;

// function validacao(): boolean {
//     if (
//         nomeInput.value.trim() ||
//         cpfInput.value.trim() ||
//         telefoneInput.value.trim() ||
//         placa.value.trim() ||
//         modelo.value.trim() ||
//         cor.value.trim()
//     ) {
//         alert("Preencha todos os campos.");
//         return false;
//     }

//     if (!testeCpf.test(cpfInput.value)) {
//         alert("CPF inválido.");
//         return false;
//     }

//     if (!testeTelefone.test(telefoneInput.value)) {
//         alert("Telefone inválido.");
//         return false;
//     }

//     return true;
// }



function  ParaMinutos(numero:number,uni:string):number {

      return uni === "horas" ? numero * 60 :numero
    
}


button?.addEventListener("click", async () => {


//  if(!validacao()){
//     return
//  }
 const numero = Number(tempoInput.value);

  if(!numero || numero<= 0){
    alert("Digite um valor valido")
    return
  }

    const TempoEmMinutos = ParaMinutos(Number(tempoInput.value), select.value);
 
    try{

   
    let cadastro = await fetch('http://localhost:3000/Cadastro', {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nomeInput?.value,
            cpf: cpfInput?.value,
            telefone: telefoneInput?.value,
            tempo: TempoEmMinutos,
            placa: placa?.value,
            modelo: modelo?.value,
            cor: cor?.value
        })
    })
 
    let respostadoCadastro = await cadastro.json()

 if (!cadastro.ok) {
            alert(respostadoCadastro.erro);
            return;
        }
 console.log(respostadoCadastro)
}

 catch (erro) {
        // o fetch nem conseguiu falar com o servidor
        console.log("Erro ao se conectar ao servidor", erro);
        alert("Não foi possível conectar ao servidor");
    }
   
})

