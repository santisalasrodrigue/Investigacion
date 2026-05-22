const http = require("http");

const PORT = 3001;

const server = http.createServer((req, res) => {
  const delay = Math.floor(Math.random() * 20) + 5;

  setTimeout(() => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "X-Protocolo": "HTTP/1.1",
    });
    res.end(
      JSON.stringify({
        recurso: req.url,
        protocolo: "HTTP/1.1",
        timestamp: Date.now(),
      })
    );
  }, delay);
});

server.listen(PORT, () => {
  console.log(`[HTTP/1.1] Servidor corriendo en http://localhost:${PORT}`);
});