import { config } from "dotenv";
config();

import * as http from "http";
import { ofError } from "@r37r0m0d3l/of";
import castToInt from "@corefunc/corefunc/cast/to/int";

import { app } from "./app";
import { debugHttp } from "./helpers/debugHttp";
import { serviceDatabase } from "./services/database";

function normalizePort(value: unknown): number {
  const normalPort = castToInt(value, 0);
  // const normalPort = +value;
  if (normalPort >= 0 || normalPort <= 9999) {
    return normalPort;
  }
  debugHttp(`[${normalPort}] is not valid port`);
  process.exit(1);
}

const port = normalizePort(process.env.PORT);
app.set("port", port);

const server = http.createServer(app);

server.on("error", function onError(error: NodeJS.ErrnoException): void {
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
});

server.on("listening", function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  if (typeof addr === "string") {
    debugHttp(`Listening on ${bind}: ${addr}`);
  } else {
    debugHttp(`Listening on ${bind}: http://localhost:${addr.port}`);
  }
});

(async (): Promise<void> => {
  const error = await ofError(serviceDatabase.init());
  if (error) {
    debugHttp(error.message);
    process.exit(1);
  }
  server.listen(port);
})();
