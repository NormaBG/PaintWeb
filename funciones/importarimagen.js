document.getElementById("cargarImagen").addEventListener("click", function() {
    document.getElementById("inputArchivo").click(); // Simula clic en input para seleccionar archivo
});

document.getElementById("inputArchivo").addEventListener("change", function(event) {
    cargarImagen(event);
});


function importarImagen(event) {
    var archivo = event.target.files[0];
    var lector = new FileReader();

    lector.onload = function(event) {
        var imagen = new Image();
        imagen.onload = function() {
            ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
        }
        imagen.src = event.target.result;
    }

    if (archivo) {
        lector.readAsDataURL(archivo);
    }
}

function cargarImagen(event) {
    var archivo = event.target.files[0];
    var lector = new FileReader();

    lector.onload = function(event) {
        var datosJSON = event.target.result;
        var datosImagen = JSON.parse(datosJSON);

        // Restaurar el dibujo
        restaurarDibujo(datosImagen);
    };

    if (archivo) {
        lector.readAsText(archivo);
    }
}

function restaurarDibujo(datosImagen) {
    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar cada trazo guardado
    datosImagen.trazos.forEach(function(trazo) {
        // Restaurar las propiedades del trazo
        ctx.strokeStyle = trazo.color;
        ctx.lineWidth = trazo.grosor;

        // Dibujar el trazo
        ctx.beginPath();
        ctx.moveTo(trazo.puntos[0].x, trazo.puntos[0].y);
        trazo.puntos.forEach(function(punto) {
            ctx.lineTo(punto.x, punto.y);
        });
        ctx.stroke();
    });
}
