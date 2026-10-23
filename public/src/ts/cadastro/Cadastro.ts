// Ponto de entrada da página de cadastro.

import "../shared/navegacao.js"
import { mostrarSucesso } from "../shared/mensagens.js"
import { ParaMinutos } from "./validacao.js"
import { enviarCadastro } from "./api.js"

let nomeInput = document.querySelector<HTMLInputElement>("#nome")!
let cpfInput = document.querySelector<HTMLInputElement>("#cpf")!
let telefoneInput = document.querySelector<HTMLInputElement>("#telefone")!
let tempoInput = document.querySelector<HTMLInputElement>("#tempo")!
let select = document.querySelector<HTMLSelectElement>("#escolharTempo select")!
let placa = document.querySelector<HTMLInputElement>("#placa")!
let modelo = document.querySelector<HTMLInputElement>("#modelo")!
let cor = document.querySelector<HTMLInputElement>("#cor")!
let button = document.querySelector<HTMLButtonElement>("#buttoncadastro")!

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
}

for (const [nome, el] of Object.entries(elementos)) {

    if (!el) {

        throw new Error(`Elemento "${nome}" não encontrado no HTML.`)

    }

}

button?.addEventListener("click", async () => {

    const numero = Number(tempoInput.value)

    if (!numero || numero <= 0) {

        alert("Digite um valor valido")

        return

    }

    const TempoEmMilisegundos = ParaMinutos(numero, select.value)

    let respostadoCadastro: { erro?: string }

    button.disabled = true

    try {

        let cadastro = await enviarCadastro({

            nome: nomeInput.value.trim(),

            cpf: cpfInput.value.trim(),

            telefone: telefoneInput.value.trim(),

            tempo: TempoEmMilisegundos,

            placa: placa.value.trim(),

            modelo: modelo.value.trim(),

            cor: cor.value.trim()

        })

        respostadoCadastro = await cadastro.json()
      

        if (!cadastro.ok) {

            alert(respostadoCadastro.erro)

            return

        }

        console.log(respostadoCadastro)
        mostrarSucesso()

    }

    catch (erro) {

        console.log("Erro ao se conectar ao servidor", erro)

        alert("Não foi possível conectar ao servidor")

        return

    }

    finally {

        button.disabled = false
 nomeInput.value = ""
    cpfInput.value = ""
    telefoneInput.value = ""
    tempoInput.value = ""
    placa.value = ""
    modelo.value = ""
    cor.value = ""
   
    }

})