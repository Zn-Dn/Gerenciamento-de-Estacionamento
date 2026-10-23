export function mostrarSucesso() {
    const card = document.createElement("div");
    card.classList.add("card-sucesso");
    card.textContent = "✅ Cadastro realizado com sucesso!";
document.body.appendChild(card); 
    setTimeout(()=>{
    card.remove()
    },20000)
    
     
}