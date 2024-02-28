document.getElementById("guardarimagen").addEventListener("click", function() {
    guardarImagen();
});

function guardarImagen() {
    var enlace = document.createElement('a');
    enlace.href = myCanvas.toDataURL("image/png");
    enlace.download = "dibujo555.json";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}
