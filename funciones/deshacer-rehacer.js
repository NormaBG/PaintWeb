function deshacer() {
  if (historicoFuturo.length > 0) {
    historicoFuturo.unshift(historicoPasado.pop());
  }else{
    console.log("No hay nada que deshacer");
    console.log(historicoPasado);
  }
}

function rehacer() {
  if (historicoFuturo.length > 0) {
    historicoPasado.push(historicoFuturo.shift());
  }else{
    console.log("No hay nada que rehacer");
    console.log(historicoPasado);
  }
}