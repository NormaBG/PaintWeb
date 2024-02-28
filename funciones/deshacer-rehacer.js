document.getElementById("undoButton").addEventListener("click", function() {
  deshacer();
});

document.getElementById("redoButton").addEventListener("click", function() {
  rehacer();
});


function deshacer() {
  if (historicoPasado.length > 0) {
    // Remover el último elemento de la pila
    var ultimoElemento = historicoPasado.pop();
    // Limpiar el canvas el ultimo dibujo
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    // Volver a dibujar todos los elementos en la pila excepto el último

    historicoPasado.forEach(function(elemento) {
      switch (elemento.tipo) {
        case "Linea":
          Linea(elemento.inicio, elemento.final);
          break;
        case "Algoritmo3":
          Algoritmo3(elemento.inicio, elemento.final);
          break;
        case "CuadradoDibujo":
          CuadradoDibujo(elemento.inicio, elemento.final);
          break;
        case "BresenhamCircle":
          BresenhamCircle(elemento.centro, elemento.radio);
          break;
        case "TrigonometricoCircle":
          TrigonometricoCircle(elemento.grados, elemento.numLados);
          break;
        case "Ellipse":
          Ellipse(elemento.centro, elemento.radioX, elemento.radioY);
          break;
          }
      });
      // Limpiar la pila de historial futuro
      historicoFuturo = [];
  } else {
      console.log("No hay elementos para deshacer.");
  }
}

function rehacer() {
  if (historicoFuturo.length > 0) {
    // Tomar el último elemento de la pila de historial futuro
    var siguienteElemento = historicoFuturo.pop();
    // Dibujar el elemento en el canvas
    switch (siguienteElemento.tipo) {
      case "Algoritmo3":
        Algoritmo3(siguienteElemento.inicio, siguienteElemento.final);
        break;
      case "CuadradoDibujo":
        CuadradoDibujo(siguienteElemento.inicio, siguienteElemento.final);
        break;
      case "BresenhamCircle":
        BresenhamCircle(siguienteElemento.centro, siguienteElemento.radio);
        break;
      case "TrigonometricoCircle":
        TrigonometricoCircle(siguienteElemento.grados, siguienteElemento.numLados);
        break;
      case "Ellipse":
        Ellipse(siguienteElemento.centro, siguienteElemento.radioX, siguienteElemento.radioY);
        break;
    }
    // Agregar el elemento al historial pasado
    historicoPasado.push(siguienteElemento);
  } else {
    console.log("No hay elementos para rehacer.");
  }
}
