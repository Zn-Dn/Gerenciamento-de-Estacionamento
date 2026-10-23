// Roda sozinho quando o arquivo é importado (não precisa de export).

let voltaparadashboard = document.querySelector("#button-left")?.addEventListener("click",()=>{
   window.location.href = "/dashboard.html"; 
})

let irparabuscar = document.querySelector("#button-right")?.addEventListener("click",()=>{
   window.location.href = "/motorista.html"; 
})