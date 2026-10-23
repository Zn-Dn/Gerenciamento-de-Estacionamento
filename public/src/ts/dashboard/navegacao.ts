// Roda sozinho quando o arquivo é importado.

const buttonCadastra = document.querySelector<HTMLButtonElement>(".cadastra")
 const buscar = document.querySelector<HTMLButtonElement>("#buscar")

buttonCadastra?.addEventListener("click",()=>{
  
    window.location.href = "/cadastro.html";
})

buscar?.addEventListener("click",()=>{
  
    window.location.href = "/motorista.html";
})