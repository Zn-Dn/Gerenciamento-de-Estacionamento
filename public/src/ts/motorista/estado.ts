// Estado compartilhado entre arquivos.
// Uma variável exportada com "let" não pode ser reatribuída por quem importa,
// então os valores que mudam ficam como propriedades de um objeto.
export const estado = {
    intervalo: undefined as number | undefined,
    motoristaAtual: null as string | null
}