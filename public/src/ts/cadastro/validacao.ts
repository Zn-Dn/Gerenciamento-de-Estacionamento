// Antes ela lia cpfInput, telefoneInput e placa direto da página.
// Agora recebe os valores por parâmetro, porque os elementos ficam no cadastro.ts.
export function verificacaoDeEstrutura(cpf: string, telefone: string, placa: string){
    const Verificacpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    const verificaTelefone = /^\(\d{2}\) 9\d{4}-\d{4}$/
    const verificaPlaca = /^[A-Z]{3}-\d{4}$/


    if(Verificacpf.test(cpf) && verificaTelefone.test(telefone) && verificaPlaca.test(placa)){
        return
    }
}

export function ParaMinutos(numero: number, uni: string): number {

    return uni === "horas" ? numero * 3600000 : numero * 60000

}