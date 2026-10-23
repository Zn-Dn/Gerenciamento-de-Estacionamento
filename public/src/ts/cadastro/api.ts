// Formato do que o servidor espera receber em /Cadastro
export interface DadosCadastro {
    nome: string
    cpf: string
    telefone: string
    tempo: number
    placa: string
    modelo: string
    cor: string
}

// Só faz a requisição e devolve a Response; quem decide o que fazer com ela é o cadastro.ts
export async function enviarCadastro(dados: DadosCadastro): Promise<Response> {

    let cadastro = await fetch("/Cadastro", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(dados)

    })

    return cadastro

}