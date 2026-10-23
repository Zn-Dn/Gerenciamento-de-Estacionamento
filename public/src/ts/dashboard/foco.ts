let mostra = document.createElement("button")
mostra.innerHTML = `<i class="fa-solid fa-arrows-to-dot"></i>`;
mostra.classList.add("mostra")
let body = document.querySelector<HTMLBodyElement>("body")?.appendChild(mostra)

mostra?.addEventListener("click", () => {
    mostra.style.display = "none"
    Cards?.classList.remove("escondido");
    Opcoes?.classList.remove("escondido");
});

let Focus = document.querySelector<HTMLButtonElement>(".focus")
let Cards = document.querySelector<HTMLSelectElement>(".cards")
let Opcoes = document.querySelector<HTMLSelectElement>(".opcoes")

Focus?.addEventListener("click", () => {
    mostra.style.display = "flex"
    Cards?.classList.toggle("escondido");
    Opcoes?.classList.toggle("escondido");
});