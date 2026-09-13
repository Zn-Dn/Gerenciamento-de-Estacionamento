"use strict";
let Senha = document.querySelector("#senha");
let email = document.querySelector("#email");
let entra = document.querySelector(".entrar");
console.log('teste');
entra?.addEventListener("click", async () => {
    const respostaLogin = await fetch('http://localhost:3000/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email?.value,
            senha: Senha?.value
        })
    });
    const resultado = await respostaLogin.json();
    console.log(resultado);
});
