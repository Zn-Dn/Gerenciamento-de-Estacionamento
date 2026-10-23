let estadoDeAcao = false;

export function iniciar() {

        estadoDeAcao = true; 
    }



export function iniciarArraste(event: MouseEvent, card: HTMLElement) {
    if(estadoDeAcao){

    
const mouseX  = event.clientX;
const mouseY  = event.clientY;



const valorcardX = card.offsetLeft + card.offsetWidth /2; ;
const valorcardY = card.offsetTop + card.offsetHeight /2;;

const distanciaX = mouseX - valorcardX;
const distanciaY = mouseY - valorcardY;

card.style.transform = `translate(${distanciaX}px, ${distanciaY}px)`;
}}


export function pararArraste() {
    estadoDeAcao = false;
}