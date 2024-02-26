function bucle(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < historicoPasado.length; i++) {
        historicoPasado[i].dibujar();        
    }

    clearTimeout(bucleTimeout);
    bucleTimeout = setTimeout(bucle, 33);


}