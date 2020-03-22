import { config } from "dotenv";
config();

import * as http from "http";
import { ofError } from "@r37r0m0d3l/of";

import { app } from "./app";
import { debugHttp } from "./helpers/debugHttp";
import { serviceDatabase } from "./services/database";

function normalizePort(val): boolean | number {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

function onError(error): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case "EACCES":
      debugHttp(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      debugHttp(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const server = http.createServer(app);

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debugHttp(`Listening on: ${bind}`);
}

server.on("error", onError);
server.on("listening", onListening);

(async (): Promise<void> => {
  const error = await ofError(serviceDatabase.init());
  if (error) {
    debugHttp(error.message);
    process.exit(1);
  }
  server.listen(port);
})();
