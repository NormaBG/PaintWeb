//guardar el elemento y el contexto
const mainCanvas = document.getElementById('main-canvas');
const context = mainCanvas.getContext('2d');

let initialX = 0;
let initialY = 0;

const dibujar = (cursorX, cursorY) => {
    context.beginPath(); //iniciar un nuevo trazo
    context.moveTo(initialX,initialY); //mover el cursor a la posicion inicial
    context.lineWidth = 20; //ancho de la linea
    context.strokeStyle = '#000'; //color de la linea
    context.lineCap = 'round'; //forma de la linea
    context.lineJoin = 'round'; //forma de la linea
    context.lineTo(cursorX, cursorY); //trazar una linea desde la posicion inicial hasta la posicion actual
    context.stroke(); //dibujar la linea

    initialX = cursorX;
    initialY = cursorY;
}

const mouseDown = (evt) => {
    initialX = evt.offsetX;
    initialY = evt.offsetY;
    dibujar(initialX, initialY);
    mainCanvas.addEventListener("mousemove", mouseMoving);
} 

const mouseMoving = (evt) => { 
    dibujar(evt.offsetX, evt.offsetY);
 }

const mouseUp = () => {
    mainCanvas.removeEventListener("mousemove", mouseMoving);
}


mainCanvas.addEventListener("mousedown", mouseDown);
mainCanvas.addEventListener("mouseup", mouseUp);