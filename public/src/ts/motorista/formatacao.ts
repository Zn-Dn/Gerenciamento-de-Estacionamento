export function formatarTempo(tempoEmMs: number): string {

    const h = Math.floor(tempoEmMs / 3600000);
    const m = Math.floor((tempoEmMs % 3600000) / 60000);

    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;

    return `${h}h ${m}min`;
}

export function formatarTelefone(telefone: string): string {

    if(telefone.length < 11){
    return ("valor nao correspode")
    }
    
    const numeros = telefone.replace(/\D/g, "");

    return numeros.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
    );
}