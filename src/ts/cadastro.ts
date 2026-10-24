const nomeInput = document.querySelector<HTMLInputElement>("#nome")!;
const cpfInput = document.querySelector<HTMLInputElement>("#cpf")!;
const telefoneInput = document.querySelector<HTMLInputElement>("#telefone")!;
const tempoInput = document.querySelector<HTMLInputElement>("#tempo")!;
const select = document.querySelector<HTMLSelectElement>("#escolharTempo select")!;
const placa = document.querySelector<HTMLInputElement>("#placa")!;
const modelo = document.querySelector<HTMLInputElement>("#modelo")!;
const cor = document.querySelector<HTMLInputElement>("#cor")!;
const button = document.querySelector<HTMLButtonElement>("#buttoncadastro")!;

const elementos = {
    nomeInput,
    cpfInput,
    telefoneInput,
    tempoInput,
    select,
    placa,
    modelo,
    cor,
    button,
};

for (const [nome, el] of Object.entries(elementos)) {
    if (!el) {
        throw new Error(`Elemento "${nome}" não encontrado no HTML.`);
    }
}


function ParaMilissegundos(numero: number, uni: string): number {
    return uni === "horas" ? numero * 3600000 : numero * 60000;
}

// CORREÇÃO: removido o "?." do button (ele já foi verificado acima e não pode ser null).
button.addEventListener("click", async () => {
    const numero = Number(tempoInput.value);

    if (!numero || numero <= 0) {
        alert("Digite um valor valido");

        return;
    }

    const TempoEmMilisegundos = ParaMilissegundos(numero, select.value);

    button.disabled = true;

    try {
        const cadastro = await fetch("/Cadastro", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                nome: nomeInput.value.trim(),
                cpf: cpfInput.value.trim(),
                telefone: telefoneInput.value.trim(),
                tempo: TempoEmMilisegundos,
                placa: placa.value.trim(),
                modelo: modelo.value.trim(),
                cor: cor.value.trim(),
            }),
        });

        const respostadoCadastro: { erro?: string } = await cadastro.json().catch(() => ({}));

        if (!cadastro.ok) {
            // CORREÇÃO: se "erro" não vier no JSON, o alert mostrava "undefined".
            alert(respostadoCadastro.erro ?? "Não foi possível realizar o cadastro");

            return;
        }

        console.log(respostadoCadastro);
        mostrarSucesso();

    
        nomeInput.value = "";
        cpfInput.value = "";
        telefoneInput.value = "";
        tempoInput.value = "";
        placa.value = "";
        modelo.value = "";
        cor.value = "";
    } catch (erro) {
        console.log("Erro ao se conectar ao servidor", erro);

        alert("Não foi possível conectar ao servidor");

        return;
    } finally {
        button.disabled = false;
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


document.querySelector("#button-left")?.addEventListener("click", () => {
    window.location.href = "/dashboard.html";
});

document.querySelector("#button-right")?.addEventListener("click", () => {
    window.location.href = "/motorista.html";
});