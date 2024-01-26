var ModosDisp = ["linea", "lapiz", "borrar","Cuadrado"];
var PuntoInicio = null;
var PuntoFinal = null;
var ctx; 
var Modo = "";


var ColorTrazos = "#000000";
var GrosorTrazos = 2;


function CambiarModo(NuevoModo) {
    Modo = NuevoModo;
    PuntoInicio = null;
    PuntoFinal = null;
}


// CANVAS
document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("myCanvas");
    var drawing = false; 
    ctx = canvas.getContext("2d");  // Asignar el contexto global aquí


    // Configurar color y grosor iniciales
    ctx.strokeStyle = ColorTrazos;
    ctx.lineWidth = GrosorTrazos;

    //Tamaño del canvas
    canvas.width = 1534;
    canvas.height = 650;


    //Obtener las cordenadas del cursor
    function obtenerCoordenadas(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function Funcion_Grosor_Color(x, y) {
        var halfThickness = Math.floor(GrosorTrazos / 2);

        for (var i = -halfThickness; i <= halfThickness; i++) {
            for (var j = -halfThickness; j <= halfThickness; j++) {
                ctx.fillStyle = ColorTrazos;
                ctx.fillRect(x + i, y + j, 1, 1);
            }
        }
    }


    canvas.addEventListener("mousemove", function (event) {
        if (ModosDisp.includes(Modo)) {
            var coordenadas = obtenerCoordenadas(event);

            if (Modo === "lapiz" && drawing) {
                ctx.lineTo(coordenadas.x, coordenadas.y);
                ctx.stroke();
            } else if (Modo === "borrar" && drawing) {
                ctx.clearRect(coordenadas.x - 10, coordenadas.y - 10, 30, 30);
            }else if( Modo === "Cuadrado" && drawing ){
                

            }
        }
    });

    
    canvas.addEventListener("mousedown", function (event) {
        if (Modo === "linea") {
            if (!PuntoInicio) {
                PuntoInicio = obtenerCoordenadas(event);
            } else {
                PuntoFinal = obtenerCoordenadas(event);
                Algoritmo(PuntoInicio, PuntoFinal);
                PuntoInicio = null;
                PuntoFinal = null;
            }

        }else if(Modo === "Cuadrado"){
            if (!PuntoInicio) {
                PuntoInicio = obtenerCoordenadas(event);
            } else {
                PuntoFinal = obtenerCoordenadas(event);
                CuadradoDibujo(PuntoInicio, PuntoFinal);
                PuntoInicio = null;
                PuntoFinal = null;
            }

        } else if (ModosDisp.includes(Modo)) {
            if (Modo === "lapiz" || Modo === "borrar") {
                ctx.beginPath();
                var coordenadas = obtenerCoordenadas(event);
                ctx.moveTo(coordenadas.x, coordenadas.y);
                drawing = true;
            }
        }
    });

    canvas.addEventListener("mouseup", function () {
        drawing = false;  // Se desactiva la bandera de dibujo al soltar el botón del mouse
    });

    function Algoritmo1(Inicio, Final) {
        // Formula: y = mx + b
    
        // Calcular las diferencias en x e y
        var dx = Final.x - Inicio.x;
        var dy = Final.y - Inicio.y;
    
        // Calcular la pendiente
        var m = dy / dx;
    
        // Intercambiar los puntos para que siempre se dibuje de izquierda a derecha
        if (Inicio.x > Final.x) {
            var temp = Inicio;
            Inicio = Final;
            Final = temp;
        }
    
        // Coordenada inicial
        var x = Inicio.x;
        var y = Inicio.y;
    
        // Determinar el cuadrante
        var xIncrement, yIncrement;
    
        // Si la pendiente es menor o igual a 1
        if (Math.abs(m) <= 1) {
            xIncrement = 1;
            yIncrement = m;
        } else { // Si la pendiente es mayor a 1
            xIncrement = 1 / Math.abs(m);
            yIncrement = m < 0 ? -1 : 1;
        }
    
        // Dibujar los puntos intermedios
        while (x <= Final.x) {
            Funcion_Grosor_Color(Math.round(x), Math.round(y));
            x += xIncrement;
            y += yIncrement;
        }
    
        // Pintar el punto final
        Funcion_Grosor_Color(Final.x, Final.y);
    }

    // Algoritmo de BRESENHAM
    function Algoritmo(Inicio, Final) {
        // Fórmulas P = 2Δy - Δx
        // Si Pk < 0: (xk + 1, yk) y pk + 1 = pk + 2Δy
        // Si pk > 0: (xk + 1, yk + 1) y pk + 1 = pk + 2Δy - 2Δx

        // Calcular las diferencias en x e y
        var dx = Math.abs(Final.x - Inicio.x);
        var dy = Math.abs(Final.y - Inicio.y);

        // Determinar la dirección de incremento/decremento en x e y
        var sx = (Inicio.x < Final.x) ? 1 : -1;
        var sy = (Inicio.y < Final.y) ? 1 : -1;

        // Inicializar P, que se utiliza en el algoritmo
        var P = dx - dy;

        while (true) {
            // Dibujar el píxel en la posición actual
            Funcion_Grosor_Color(Inicio.x, Inicio.y);

            // Se verificar si se alcanzó el punto final
            if ((Inicio.x === Final.x) && (Inicio.y === Final.y)) {
                break;
            }

            // Calcular P2, una variable auxiliar que ayuda en la toma de decisiones
            var P2 = 2 * P;

            // Actualizar P y las coordenadas según la condicion
            if (P2 > -dy) {
                P -= dy;
                Inicio.x += sx;
            }

            if (P2 < dx) {
                P += dx;
                Inicio.y += sy;
            }
        }
    }

    //Algoritmo DDA
    function Algoritmo3(Inicio, Final) {


        // Calcular la distancia entre los dos puntos
        var dx = Final.x - Inicio.x;
        var dy = Final.y - Inicio.y;

        // Calcular el numero de pasos
        var steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

        // Calcular el incremento para cada paso
        var xIncrement = dx / steps;
        var yIncrement = dy / steps;

        // Coordenada inicial
        var x = Inicio.x;
        var y = Inicio.y;

        // Dibujar cada punto
        for (var i = 0; i <= steps; i++) {

            // Redondear las coordenadas
            var roundedX = Math.round(x);
            var roundedY = Math.round(y);

            // Dependiendo del grosor, dibujar más píxeles alrededor del punto
            for (var k = 0; k < GrosorTrazos; k++) {
                for (var j = 0; j < GrosorTrazos; j++) {
                    ctx.fillStyle = ColorTrazos;
                    ctx.fillRect(roundedX + k, roundedY + j, 1, 1);
                }
            }

            // Actualizar las coordenadas con el incremento
            x += xIncrement;
            y += yIncrement;
        }
    }


    function CuadradoDibujo(Inicio, Final) {
        // Calcular el ancho y alto del cuadrado
        var width = Math.abs(Final.x - Inicio.x);
        var height = Math.abs(Final.y - Inicio.y);
    
        // Determinar el punto de inicio y el punto final para el cuadrado
        var cuadradoStart = {
            x: (Final.x > Inicio.x) ? Inicio.x : Final.x,
            y: (Final.y > Inicio.y) ? Inicio.y : Final.y
        };
    
        var cuadradoEnd = {
            x: cuadradoStart.x + Math.min(width, height),
            y: cuadradoStart.y + Math.min(width, height)
        };
    
        // Dibujar el contorno del cuadrado
        Algoritmo3(cuadradoStart, { x: cuadradoEnd.x, y: cuadradoStart.y });
        Algoritmo3({ x: cuadradoEnd.x, y: cuadradoStart.y }, cuadradoEnd);
        Algoritmo3(cuadradoEnd, { x: cuadradoStart.x, y: cuadradoEnd.y });
        Algoritmo3({ x: cuadradoStart.x, y: cuadradoEnd.y }, cuadradoStart);
    }
});
