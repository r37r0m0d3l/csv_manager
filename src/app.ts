import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as createError from "http-errors";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as sassMiddleware from "node-sass-middleware";

import { routerAccounts } from "./routes/accounts";
// noinspection TypeScriptPreferShortImport
import { routerIndex } from "./routes/index";

const app = express();

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(cors({ credentials: false, origin: false }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PATCH,PUT,DELETE");
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "../public"),
    dest: path.join(__dirname, "../public"),
    indentedSyntax: true,
    sourceMap: true,
  }),
);
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", routerIndex);
app.use("/accounts", routerAccounts);

app.use(function (_req, _res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

export { app };
