let nomeInput = document.querySelector<HTMLInputElement>("#nome")
let cpfInput = document.querySelector<HTMLInputElement>("#cpf")
let telefoneInput = document.querySelector<HTMLInputElement>("#telefone")
let tempoInput = document.querySelector<HTMLInputElement>("#tempo")
let select = document.querySelector<HTMLSelectElement>("#escolharTempo select")!;

// Carro
let placa = document.querySelector<HTMLInputElement>("#placa")
let modelocor = document.querySelector<HTMLInputElement>("#modelocor")
let cor = document.querySelector<HTMLInputElement>("#cor")


let button = document.querySelector<HTMLButtonElement>("#cadastro")


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
    })
console.log("teste")
    let respostadoCadastro = await cadastro.json()
    console.log(respostadoCadastro)
})
