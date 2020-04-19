import express = require("express");
import * as fsExtra from "fs-extra";
import multer from "multer";
import { of } from "@r37r0m0d3l/of";

import { csv2db } from "../core/csv2db";
import { debugHttp } from "../helpers/debugHttp";
import { modelAccount } from "../models/account";

const routerAccounts = express.Router();

routerAccounts
  .post("/", multer({ dest: "uploads/" }).single("file"), async function (req, res) {
    const [result, error] = await of(csv2db(req.file.path));
    if (error) {
      debugHttp(error.message);
      res.status(500).send("500 Internal Server Error");
      return;
    }
    await of(fsExtra.remove(req.file.path));
    res.status(200).jsonp({ ok: true, ...result });
  })
  .get("/", async function (_req, res) {
    const [result, error] = await of(modelAccount.readAllAsJSON());
    if (error) {
      res.status(500).send("500 Internal Server Error");
      return;
    }
    res.jsonp(result);
  })
  .get("/download", async function (_req, res) {
    const [result, error] = await of(modelAccount.readAllAsJSON());
    if (error) {
      debugHttp(error.message);
      res.status(500).send("500 Internal Server Error");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment;filename=accounts.json");
    if (result.length === 0) {
      res.jsonp([]);
      return;
    }
    res.write("[\n");
    res.write(JSON.stringify(result.shift()));
    const intervalID = setInterval(function () {
      if (result.length === 0) {
        res.write("\n]");
        res.end();
        clearInterval(intervalID);
        return;
      }
      res.write(`,\n${JSON.stringify(result.shift())}`);
    }, 1);
  })
  .get("/:id", async function (req, res) {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(422).send("422 Unprocessable Entity");
      return;
    }
    const [result, error] = await of(modelAccount.readByIdAsJSON(id));
    if (error) {
      debugHttp(error.message);
      res.status(500).send("500 Internal Server Error");
      return;
    }
    if (!result) {
      res.status(404).send("404 Not found");
      return;
    }
    res.jsonp(result);
  });

export { routerAccounts };
