"use strict";
let nomeInput = document.querySelector("#nome");
let cpfInput = document.querySelector("#cpf");
let telefoneInput = document.querySelector("#telefone");
let tempoInput = document.querySelector("#tempo");
let select = document.querySelector("#escolharTempo select");
// Carro
let placa = document.querySelector("#placa");
let modelo = document.querySelector("#modelo");
let cor = document.querySelector("#cor");
let button = document.querySelector("#buttoncadastro");
// validacao
 

function ParaMinutos(numero, uni) {
    return uni === "horas" ? numero * 60 : numero;
}


button?.addEventListener("click", async () => {



    const numero = Number(tempoInput.value);
    if (!numero || numero <= 0) {
        alert("Digite um valor valido");
        return;
    }
    const TempoEmMinutos = ParaMinutos(Number(tempoInput.value), select.value);
    try {
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
        });
        let respostadoCadastro = await cadastro.json();
        if (!cadastro.ok) {
            alert(respostadoCadastro.erro);
            return;
        }
        console.log(respostadoCadastro);
    }
    catch (erro) {
        // Falhou ao se comunicar com o server
        console.log("Erro ao se conectar ao servidor", erro);
        alert("Não foi possível conectar ao servidor");
    }
});
