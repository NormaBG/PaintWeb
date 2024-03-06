var ModosDisp = ["linea", "lapiz", "borrar","Cuadrado"];
var PuntoInicio = null;
var PuntoFinal = null;
var ctx; 
var Modo = "";

var historicoPasado = new Array();
var historicoFuturo = new Array();

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
        //Tamaño del canvas
        canvas.width = 1534;
        canvas.height = 650;
    var area1 = { startX: 50, startY: 50, width: canvas.width, height: canvas.height };
    var area2 = { startX: 250, startY: 250, width: canvas.width, height: canvas.height };

    // Configurar color y grosor iniciales
    ctx.strokeStyle = ColorTrazos;
    ctx.lineWidth = GrosorTrazos;


    //Obtener las cordenadas del cursor
    function obtenerCoordenadas(event) {
        // Actualizar el color de trazo desde el elemento HTML
        ColorTrazos = document.getElementById("ColorTrazos").value;
        GrosorTrazos = document.getElementById("GrosorTrazos").value;
    
        // Aplicar el color de trazo al contexto del lienzo
        ctx.strokeStyle = ColorTrazos;
    
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    function Funcion_Grosor_Color(x, y) {
        var halfThickness = Math.floor(GrosorTrazos / 2);
        ctx.fillStyle = ColorTrazos;
        ctx.fillRect(x - halfThickness, y - halfThickness, GrosorTrazos, GrosorTrazos);
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
                Algoritmo3(PuntoInicio, PuntoFinal);
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
        }else if(Modo === "Circulo"){
            if (!PuntoInicio) {
                PuntoInicio = obtenerCoordenadas(event);
            } else {
                PuntoFinal = obtenerCoordenadas(event);
                var radio = Math.sqrt(Math.pow(PuntoFinal.x - PuntoInicio.x, 2) + Math.pow(PuntoFinal.y - PuntoInicio.y, 2));
                BresenhamCircle(PuntoInicio, radio);
                PuntoInicio = null;
                PuntoFinal = null;
            }

        }else if (Modo === "Trigonometrico"){

            var numLados = parseInt(document.getElementById("TrigonometricoN").value);

            if (!PuntoInicio) {
                PuntoInicio = obtenerCoordenadas(event);
            } else {
                PuntoFinal = obtenerCoordenadas(event);
                var radio = Math.sqrt(Math.pow(PuntoFinal.x - PuntoInicio.x, 2) + Math.pow(PuntoFinal.y - PuntoInicio.y, 2));
                var grados = 360 / numLados;
                TrigonometricoCircle(grados, numLados);
                PuntoInicio = null;
                PuntoFinal = null;
            }
        }else if(Modo === "Elipse"){
            if (!PuntoInicio) {
                PuntoInicio = obtenerCoordenadas(event);
            } else {
                PuntoFinal = obtenerCoordenadas(event);
                var radioX = Math.abs(PuntoFinal.x - PuntoInicio.x);
                var radioY = Math.abs(PuntoFinal.y - PuntoInicio.y);
                Ellipse(PuntoInicio, radioX, radioY);
                PuntoInicio = null;
                PuntoFinal = null;
            }
        }else if(Modo ==="Rectangulo"){
            if (!PuntoInicio) {
                PuntoInicio = obtenerCoordenadas(event);
            } else {
                PuntoFinal = obtenerCoordenadas(event);
                RectanguloDibujo(PuntoInicio, PuntoFinal);
                PuntoInicio = null;
                PuntoFinal = null;
            }
        }else if(Modo === "rellenar"){

            var x = event.offsetX;
            var y = event.offsetY;

            var fillColor = hexToRgb(document.getElementById("relleno").value);
            var targetColor = getColorAtPixel(x, y);

            floodFill(x, y, targetColor, fillColor);
        }else if (ModosDisp.includes(Modo)) {
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

        historicoPasado.push({
            tipo: "Algoritmo3", // Tipo de dibujo
            inicio: { x: Inicio.x, y: Inicio.y }, // Coordenadas de inicio
            final: { x: Final.x, y: Final.y }, // Coordenadas finales
            color: ctx.strokeStyle, // Color de trazo
            grosor: ctx.lineWidth // Grosor de trazo
        });

        console.log("Lengt: ",historicoPasado.length);
        console.log("Pila: ", historicoPasado);

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

        historicoPasado.push({
            tipo: "CuadradoDibujo", // Tipo de dibujo
            inicio: { x: Inicio.x, y: Inicio.y }, // Coordenadas de inicio
            final: { x: Final.x, y: Final.y }, // Coordenadas finales
            color: ctx.strokeStyle, // Color de trazo
            grosor: ctx.lineWidth // Grosor de trazo
        });
        console.log(historicoPasado);
    }

    //funcion para dibujar un circulo con bresenham

    function BresenhamCircle(centro, radio) {
        console.log(centro, radio);
        var x = radio;
        var y = 0;
        var P = 1 - radio; // parametro de desicion
    
        function dibujarPuntos(centroX, centroY, x, y) {
            Funcion_Grosor_Color(centroX + x, centroY + y);
            Funcion_Grosor_Color(centroX - x, centroY + y);
            Funcion_Grosor_Color(centroX + x, centroY - y);
            Funcion_Grosor_Color(centroX - x, centroY - y);
            Funcion_Grosor_Color(centroX + y, centroY + x);
            Funcion_Grosor_Color(centroX - y, centroY + x);
            Funcion_Grosor_Color(centroX + y, centroY - x);
            Funcion_Grosor_Color(centroX - y, centroY - x);
        }
    
        while (x >= y) {
            dibujarPuntos(centro.x, centro.y, x, y);
    
            y = y + 1;
            if (P <= 0) {
                P = P + 2 * y + 3;
            } else {
                P = P + 2 * (y - x) + 5;
                x = x - 1;
            }
        }

        historicoPasado.push({
            tipo: "BresenhamCircle", // Tipo de dibujo
            centro: { x: centro.x, y: centro.y }, // Coordenadas de inicio
            radio: radio, // Coordenadas finales
            color: ctx.strokeStyle, // Color de trazo
            grosor: ctx.lineWidth // Grosor de trazo
        });
        console.log(historicoPasado);
    }

    function TrigonometricoCircle(grados, numLados) {
        var centro = PuntoInicio;
        var radio = Math.sqrt(Math.pow(PuntoFinal.x - PuntoInicio.x, 2) + Math.pow(PuntoFinal.y - PuntoInicio.y, 2));

        if (numLados > 2) {
            // Calcular las coordenadas de los puntos
            var puntos = [];
            for (var k = 0; k < numLados; k++) {
                var x = centro.x + radio * Math.cos(grados * k * Math.PI / 180);
                var y = centro.y + radio * Math.sin(grados * k * Math.PI / 180);
                puntos.push({ x: x, y: y });
            }
    
            // Dibujar las líneas que conectan los puntos
            for (var i = 0; i < puntos.length; i++) {
                var puntoActual = puntos[i];
                var puntoSiguiente = puntos[(i + 1) % puntos.length]; // Conectar con el siguiente punto o con el primero si es el último
                ctx.beginPath();
                ctx.moveTo(puntoActual.x, puntoActual.y);
                ctx.lineTo(puntoSiguiente.x, puntoSiguiente.y);
                ctx.stroke();
            }
        }else{
            alert("El numero de lados debe ser mayor a 2");
        }

        historicoPasado.push({
            tipo: "TrigonometricoCircle", // Tipo de dibujo
            centro: { x: centro.x, y: centro.y }, // Coordenadas de inicio
            radio: radio, // Coordenadas finales
            color: ctx.strokeStyle, // Color de trazo
            grosor: ctx.lineWidth // Grosor de trazo
        });
        console.log(historicoPasado);
    }

    function Ellipse(centro, radioX, radioY) {
        var x = 0;
        var y = radioY;
        var radioX2 = Math.pow(radioX, 2);
        var radioY2 = Math.pow(radioY, 2);
      
        function dibujarPuntos(centroX, centroY, x, y) {
          Funcion_Grosor_Color(centroX + x, centroY + y);
          Funcion_Grosor_Color(centroX - x, centroY + y);
          Funcion_Grosor_Color(centroX + x, centroY - y);
          Funcion_Grosor_Color(centroX - x, centroY - y);
        }
      
        while (x < radioX) {
          var d = radioY2 * (x + 0.5) * (x + 0.5) + radioX2 * (y - 1) * (y - 1) - radioX2 * radioY2;
          dibujarPuntos(centro.x, centro.y, x, y);
      
          if (d < 0) {
            x++;
          } else {
            x++;
            y--;
          }
        }
      
        while (y >= 0) {
          dibujarPuntos(centro.x, centro.y, x, y);
          y--;
        }

        historicoPasado.push({
            tipo: "Ellipse", // Tipo de dibujo
            centro: { x: centro.x, y: centro.y }, // Coordenadas de inicio
            radioX: radioX, // Coordenadas finales
            radioY: radioY, // Coordenadas finales
            color: ctx.strokeStyle, // Color de trazo
            grosor: ctx.lineWidth // Grosor de trazo
        });
        console.log(historicoPasado);
      }

      //funcion para el rectangulo

      function RectanguloDibujo(Inicio, Final) {
        // Calcular el ancho y alto del rectángulo
        var width = Math.abs(Final.x - Inicio.x);
        var height = Math.abs(Final.y - Inicio.y);
    
        // Determinar el punto de inicio y el punto final para el rectángulo
        var rectStart = {
            x: (Final.x > Inicio.x) ? Inicio.x : Final.x,
            y: (Final.y > Inicio.y) ? Inicio.y : Final.y
        };
    
        var rectEnd = {
            x: rectStart.x + width,
            y: rectStart.y + height
        };
    
        // Dibujar los lados del rectángulo
        Algoritmo3(rectStart, { x: rectEnd.x, y: rectStart.y });
        Algoritmo3({ x: rectEnd.x, y: rectStart.y }, rectEnd);
        Algoritmo3(rectEnd, { x: rectStart.x, y: rectEnd.y });
        Algoritmo3({ x: rectStart.x, y: rectEnd.y }, rectStart);
    
        historicoPasado.push({
            tipo: "RectanguloDibujo", // Tipo de dibujo
            inicio: { x: Inicio.x, y: Inicio.y }, // Coordenadas de inicio
            final: { x: Final.x, y: Final.y }, // Coordenadas finales
            color: ctx.strokeStyle, // Color de trazo
            grosor: ctx.lineWidth // Grosor de trazo
        });
        console.log(historicoPasado);
    }
    
      
    

    //funcion para rellenar figuras
    function getColorAtPixel(x, y) {
        var imageData = ctx.getImageData(x, y, 1, 1);
        var data = imageData.data;
        return [data[0], data[1], data[2], data[3]]; // RGBA
    }

    function floodFill(startX, startY, targetColor, fillColor) {
        if (targetColor.toString() === fillColor.toString()) {
            console.log("El pixel de inicio ya es del color de relleno deseado.");
            return;
        }

        var stack = [[startX, startY]];
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var width = canvas.width;
        var height = canvas.height;

        var getColorIndex = function(x, y) {
            return (y * width + x) * 4;
        };

        var isSameColor = function(pixelPos) {
            return (
                pixels[pixelPos] === targetColor[0] &&
                pixels[pixelPos + 1] === targetColor[1] &&
                pixels[pixelPos + 2] === targetColor[2] &&
                pixels[pixelPos + 3] === targetColor[3]
            );
        };

        var setColor = function(pixelPos) {
            pixels[pixelPos] = fillColor[0];
            pixels[pixelPos + 1] = fillColor[1];
            pixels[pixelPos + 2] = fillColor[2];
            pixels[pixelPos + 3] = fillColor[3];
        };

        while (stack.length) {
            var newPos, x, y, pixelPos, reachLeft, reachRight;

            newPos = stack.pop();
            x = newPos[0];
            y = newPos[1];

            pixelPos = getColorIndex(x, y);

            while (y-- >= 0 && isSameColor(pixelPos)) {
                pixelPos -= width * 4;
            }
            pixelPos += width * 4;

            reachLeft = false;
            reachRight = false;

            while (y++ < height - 1 && isSameColor(pixelPos)) {
                setColor(pixelPos);

                if (x > 0) {
                    if (isSameColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            stack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < width - 1) {
                    if (isSameColor(pixelPos + 4)) {
                        if (!reachRight) {
                            stack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += width * 4;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            255
        ] : null;
    }
});