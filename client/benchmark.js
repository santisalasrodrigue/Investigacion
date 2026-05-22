const http = require("http");
const http2 = require("http2");

const TOTAL_REQUESTS = parseInt(process.argv[2]) || 10;

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(color, msg) {
  console.log(`${color}${msg}${C.reset}`);
}

function benchmarkHTTP1(n) {
  return new Promise((resolve) => {
    const start = Date.now();
    let completadas = 0;

    for (let i = 1; i <= n; i++) {
      const req = http.request(
        {
          hostname: "localhost",
          port: 3001,
          path: `/recurso-${i}`,
          method: "GET",
        },
        (res) => {
          res.on("data", () => {});
          res.on("end", () => {
            completadas++;
            if (completadas === n) resolve(Date.now() - start);
          });
        }
      );
      req.on("error", (e) => console.error("HTTP/1.1 error:", e.message));
      req.end();
    }
  });
}

function benchmarkHTTP2(n) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const client = http2.connect("https://localhost:3002", {
      rejectUnauthorized: false,
    });

    client.on("error", reject);

    let completadas = 0;

    for (let i = 1; i <= n; i++) {
      const stream = client.request({ ":path": `/recurso-${i}` });

      stream.on("data", () => {});
      stream.on("end", () => {
        completadas++;
        if (completadas === n) {
          client.close();
          resolve(Date.now() - start);
        }
      });

      stream.on("error", (e) => console.error(`Stream ${i} error:`, e.message));
      stream.end();
    }
  });
}

async function main() {
  console.log("\n" + "=".repeat(50));
  log(C.bold, `  BENCHMARK: HTTP/1.1 vs HTTP/2`);
  log(C.cyan, `  Requests: ${TOTAL_REQUESTS}`);
  console.log("=".repeat(50));

  log(C.yellow, "\n[1/2] Ejecutando HTTP/1.1...");
  const tiempo1 = await benchmarkHTTP1(TOTAL_REQUESTS);
  log(C.yellow, `  HTTP/1.1 completado en: ${tiempo1}ms`);

  log(C.blue, "\n[2/2] Ejecutando HTTP/2...");
  const tiempo2 = await benchmarkHTTP2(TOTAL_REQUESTS);
  log(C.blue, `  HTTP/2 completado en: ${tiempo2}ms`);

  console.log("\n" + "-".repeat(50));
  log(C.bold, "  RESULTADOS:");
  console.log(`  HTTP/1.1 : ${tiempo1}ms`);
  console.log(`  HTTP/2   : ${tiempo2}ms`);

  const diff = tiempo1 - tiempo2;
  const pct = ((diff / tiempo1) * 100).toFixed(1);

  if (diff > 0) {
    log(C.green, `\n  HTTP/2 fue ${diff}ms mas rapido (${pct}% de mejora)`);
    log(C.green, `  Razon: ${TOTAL_REQUESTS} streams en 1 sola conexion TLS`);
  } else {
    log(C.cyan, `\n  Aumento N para ver la diferencia:`);
    log(C.cyan, `  node client/benchmark.js 50`);
  }
  console.log("-".repeat(50) + "\n");
}

main().catch(console.error);