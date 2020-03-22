import * as express from "express";

const routerIndex = express.Router();

routerIndex.get("/", function (_req, res) {
  res.render("index", { title: "CSV Accounts" });
});

export { routerIndex };
