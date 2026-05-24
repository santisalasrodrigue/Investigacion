HTTP/2 — Investigación con Demostración Técnica
Tema: HTTP/2
Curso: ISW-521 · Programación en Ambiente Web I
Universidad Técnica Nacional — Sede San Carlos
Estudiante: Santiago Rodriguez
Cuatrimestre: 2026-II

Descripción técnica
HTTP/2 es la segunda versión del protocolo HTTP, estandarizado en RFC 7540 (2015). No cambia la semántica de HTTP — los métodos, códigos de estado y cabeceras siguen siendo los mismos. Lo que cambia es cómo se transportan los datos: introduce una capa de framing binario entre TCP y la capa de aplicación.
El problema que resuelve es el Head-of-Line Blocking de HTTP/1.1, donde cada conexión TCP solo puede procesar una request a la vez. HTTP/2 elimina esto con multiplexing: múltiples streams independientes viajan en paralelo sobre una sola conexión TLS.
Características principales:

Multiplexing — N requests simultáneos sobre 1 sola conexión TLS
HPACK — compresión de cabeceras HTTP con tabla estática y dinámica
Framing binario — reemplaza el texto plano de HTTP/1.1
Priorización de streams — el cliente indica qué recursos son más urgentes


Estructura del proyecto
Investigacion/
├── server/
│   ├── server-http1.js   # Servidor HTTP/1.1 en puerto 3001
│   └── server-http2.js   # Servidor HTTP/2 con TLS en puerto 3002
├── client/
│   └── benchmark.js      # Cliente que compara ambos protocolos
├── certs/
│   ├── cert.pem          # Certificado TLS autofirmado
│   └── key.pem           # Llave privada
└── README.md

Requisitos

Node.js v18 o superior
Git con OpenSSL incluido (para generar los certificados)
No se requieren dependencias externas — solo módulos nativos de Node.js


Instalación y ejecución paso a paso
Paso 1 — Clonar el repositorio
git clone https://github.com/santisalasrodrigue/Investigacion.git
cd Investigacion
Paso 2 — Generar los certificados TLS
HTTP/2 requiere TLS. Ejecutar una sola vez desde Git Bash:
mkdir certs
openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "//CN=localhost"
Paso 3 — Abrir tres terminales y navegar al proyecto
cd "C:\Users\santi\OneDrive\Documents\Portafolio-ISW521\Investigacion"
Paso 4 — Terminal 1: iniciar servidor HTTP/1.1
node server/server-http1.js
Debe mostrar: [HTTP/1.1] Servidor corriendo en http://localhost:3001
Paso 5 — Terminal 2: iniciar servidor HTTP/2
node server/server-http2.js
Debe mostrar: [HTTP/2] Servidor corriendo en https://localhost:3002
Paso 6 — Terminal 3: correr el benchmark
Con 10 requests:
node client/benchmark.js 10
Con 50 requests para ver la diferencia más clara:
node client/benchmark.js 50