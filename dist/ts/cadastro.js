"use strict";
let nomeInput = document.querySelector("#nome");
let cpfInput = document.querySelector("#cpf");
let telefoneInput = document.querySelector("#telefone");
let tempoInput = document.querySelector("#tempo");
let select = document.querySelector("#escolharTempo select");
// Carro
let placa = document.querySelector("#placa");
let modelocor = document.querySelector("#modelocor");
let cor = document.querySelector("#cor");
let button = document.querySelector("#cadastro");
button?.addEventListener("click", async () => {
    let cadastro = await fetch('http://localhost:3000/Cadastro', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nomeInput?.value,
            cpf: cpfInput?.value,
            telefone: telefoneInput?.value,
            tempo: tempoInput?.value,
            placa: placa?.value,
            modelo: placa?.value,
            cor: cor?.value
        })
    });
    console.log("teste");
    let respostadoCadastro = await cadastro.json();
    console.log(respostadoCadastro);
});
