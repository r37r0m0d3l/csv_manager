import { config } from "dotenv";

config();

import mongoUriBuilder from "mongo-uri-builder";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { of } from "@r37r0m0d3l/of";

import { debugHttp } from "../helpers/debugHttp";
import { modelAccount } from "../models/account";

class ServiceDatabase {
  protected connection: mongoose.Connection;
  protected uris: string;
  public models: { [prop: string]: mongoose.Model } = {};
  public constructor() {
    const { MONGO_DB, MONGO_HOST, MONGO_PASS, MONGO_PORT, MONGO_USER } = process.env;
    this.uris = mongoUriBuilder({
      database: MONGO_DB,
      host: MONGO_HOST,
      password: MONGO_PASS,
      options: {
        authSource: "admin",
        j: true,
        retryWrites: true,
        w: "majority",
      },
      port: MONGO_PORT,
      username: MONGO_USER,
    });
    debugHttp(`MongoDB URI: ${this.uris}`);
  }
  public async init(): Promise<void> {
    return this.getConnection();
  }
  /**
   * @throws Error
   * @returns {Promise<mongoose.connection>}
   */
  public async getConnection(): Promise<Readonly<mongoose.Connection>> {
    if (this.connection) {
      return this.connection;
    }
    let error;
    [this.connection, error] = await of(
      mongoose.connect(this.uris, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    );
    if (error) {
      debugHttp(error.message);
      throw error;
    }
    [modelAccount /*, other models*/].forEach((model) => {
      const entity = model.getName();
      if (entity in this.models) {
        return;
      }
      this.models[model.getName()] = this.connection.model(
        model.getName(),
        new Schema(model.getSchema(), { strict: false }),
      );
    });
    return this.connection;
  }
}

const serviceDatabase = new ServiceDatabase();

export { serviceDatabase };
