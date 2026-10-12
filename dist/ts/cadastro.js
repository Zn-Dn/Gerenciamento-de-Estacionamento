"use strict";
let nomeInput = document.querySelector("#nome");
let cpfInput = document.querySelector("#cpf");
let telefoneInput = document.querySelector("#telefone");
let tempoInput = document.querySelector("#tempo");
let select = document.querySelector("#escolharTempo select");
let placa = document.querySelector("#placa");
let modelo = document.querySelector("#modelo");
let cor = document.querySelector("#cor");
let button = document.querySelector("#buttoncadastro");
const elementos = {
    nomeInput,
    cpfInput,
    telefoneInput,
    tempoInput,
    select,
    placa,
    modelo,
    cor,
    button
};
for (const [nome, el] of Object.entries(elementos)) {
    if (!el) {
        throw new Error(`Elemento "${nome}" não encontrado no HTML.`);
    }
}
function ParaMinutos(numero, uni) {
    return uni === "horas" ? numero * 3600000 : numero * 60000;
}
button?.addEventListener("click", async () => {
    const numero = Number(tempoInput.value);
    if (!numero || numero <= 0) {
        alert("Digite um valor valido");
        return;
    }
    const TempoEmMilisegundos = ParaMinutos(numero, select.value);
    let respostadoCadastro;
    button.disabled = true;
    try {
        let cadastro = await fetch("/Cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nomeInput.value.trim(),
                cpf: cpfInput.value.trim(),
                telefone: telefoneInput.value.trim(),
                tempo: TempoEmMilisegundos,
                placa: placa.value.trim(),
                modelo: modelo.value.trim(),
                cor: cor.value.trim()
            })
        });
        respostadoCadastro = await cadastro.json();
        if (!cadastro.ok) {
            alert(respostadoCadastro.erro);
            return;
        }
        console.log(respostadoCadastro);
        mostrarSucesso();
    }
    catch (erro) {
        console.log("Erro ao se conectar ao servidor", erro);
        alert("Não foi possível conectar ao servidor");
        return;
    }
    finally {
        button.disabled = false;
        nomeInput.value = "";
        cpfInput.value = "";
        telefoneInput.value = "";
        tempoInput.value = "";
        placa.value = "";
        modelo.value = "";
        cor.value = "";
    }
});
function mostrarSucesso() {
    const card = document.createElement("div");
    card.classList.add("card-sucesso");
    card.textContent = "✅ Cadastro realizado com sucesso!";
    document.body.appendChild(card);
    setTimeout(() => {
        card.remove();
    }, 2000);
}
let voltaparadashboard = document.querySelector("#button-left")?.addEventListener("click", () => {
    window.location.href = "/dashboard.html";
});
let irparabuscar = document.querySelector("#button-right")?.addEventListener("click", () => {
    window.location.href = "/motorista.html";
});
