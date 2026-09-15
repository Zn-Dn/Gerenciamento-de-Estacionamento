let Senha = document.querySelector<HTMLInputElement>("#senha")
let email = document.querySelector<HTMLInputElement>("#email")
let entra = document.querySelector<HTMLButtonElement>(".entrar")
const estruturaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log('teste')
entra?.addEventListener("click", async ()=>{

    if(Senha?.value === ""  || email?.value === "" ){
        return
 
    }
    else{
        if (email && estruturaEmail.test(email.value)) {
 try{
     const respostaLogin = await fetch('http://localhost:3000/login',{
        method:'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            email:email?.value,
            senha:Senha?.value
        })
    })  
    const resultado = await respostaLogin.json();
   

    if(resultado.status === true){
        window.location.href = "/src/pages/dashboard.html"
    }
    }
    catch{
        console.log("erro ao se conecta ao servindo")
    }


         }
         else{
            console.log("senha ou email nao correspondem")
            return
         }
        }
   

})