    // el elemento canvas y su contexto
    var canvas = document.getElementById("paintCanvas");
    var context = canvas.getContext("2d");

    // Variables para almacenar el estado del mouse
    var dibujar = false;
    var x1, y1;

    // funcion para empezar a dibujar
    function empezarDibujo(e) {
        dibujar = true;
        setUltimoPunto(e);
    }

    // funcion para dejar de dibujar
    function stopDibujo() {
        dibujar = false;
    }

    // funcion para actualizar las coordenadas del ultimo punto
    function setUltimoPunto(e) {
        x1 = e.clientX - canvas.offsetLeft;
        y1 = e.clientY - canvas.offsetTop;
    }

       // funcion para calcular la pendiente (m) y el termino independiente (b)
       function calcularPendiente(e) {
        var currentX = e.clientX - canvas.offsetLeft;
        var currentY = e.clientY - canvas.offsetTop;
        var pendiente = (currentY - y1) / (currentX - x1);
        var interseccion = currentY - pendiente * currentX;

        return { pendiente, interseccion };
    }

    // función para dibujar
    function Dibujar(e) {
        if (!dibujar) return;

        // estilo del trazo
        context.lineWidth = 20;
        context.lineCap = "round";
        context.strokeStyle = "black";

        // Calcula la pendiente y el término independiente
        var { pendiente, interseccion } = calcularPendiente(e);

        // Dibujar pixeles individualmente
        for (let i = 0; i < 20; i++) {
            let t = i / 20; // Utiliza más divisiones para un trazo más suave
            let currentX = x1 + (e.clientX - x1) * t;
            let currentY = pendiente * currentX + interseccion;

            // Renderiza el píxel en el lienzo
            context.fillRect(currentX, currentY, 4, 4);
        }

        // Actualiza las coordenadas del último punto
        setUltimoPunto(e);
    }
    // Event listeners para el mouse
    canvas.addEventListener("mousedown", empezarDibujo);
    canvas.addEventListener("mouseup", stopDibujo);
    canvas.addEventListener("mousemove", Dibujar);
