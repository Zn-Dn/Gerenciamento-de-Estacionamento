export async function avisarCliente(numero: number) {
    const resposta = await fetch(`/avisar/${numero}`, {
        method: "POST"
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro);   
        return;
    }

    window.open(dados.link, "_blank");   

}