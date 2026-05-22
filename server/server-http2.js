const http2 = require("http2");
const fs = require("fs");
const path = require("path");

const PORT = 3002;

const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")),
});

server.on("stream", (stream, headers) => {
  const url = headers[":path"];
  const delay = Math.floor(Math.random() * 20) + 5;

  setTimeout(() => {
    stream.respond({
      ":status": 200,
      "content-type": "application/json",
      "x-protocolo": "HTTP/2",
    });

    stream.end(
      JSON.stringify({
        recurso: url,
        protocolo: "HTTP/2",
        timestamp: Date.now(),
      })
    );
  }, delay);
});

server.on("error", (err) => console.error("[HTTP/2] Error:", err));

server.listen(PORT, () => {
  console.log(`[HTTP/2] Servidor corriendo en https://localhost:${PORT}`);
});