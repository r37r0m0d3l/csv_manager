import * as mongoose from "mongoose";
import { of } from "@r37r0m0d3l/of";
import { Schema } from "mongoose";
import { Vicis } from "vicis";

import { serviceDatabase } from "../services/database";

class ModelBasic {
  protected entityName: string;
  protected serializer: Vicis;
  protected schema: object;
  public constructor(name: string, schema: object, serialization: object) {
    this.entityName = name;
    this.schema = schema;
    this.serializer = Vicis.factory({
      ...{
        exclude: [/^(?:_)(?:_)?/],
        rename: { _id: "id" },
        order: ["id"],
      },
      ...serialization,
    });
  }
  public getName(): string {
    return this.entityName;
  }
  public getSchema(): object {
    return this.schema;
  }
  private async getModel(): Promise<Readonly<mongoose.Connection>> {
    const connection = await serviceDatabase.init();
    const entity = this.getName();
    if (!(entity in serviceDatabase.models)) {
      serviceDatabase.models[entity] = connection.model(
        entity,
        new Schema(this.getSchema(), { strict: false }),
      );
    }
    return serviceDatabase.models[entity];
  }
  public async readAll(): Promise<object[]> {
    const Model = await this.getModel();
    const [documents, notFound] = await of(Model.find());
    if (notFound) {
      throw notFound;
    }
    return this.serializer.fromArray(documents);
  }
  public async readById(id: string): Promise<object> {
    const Model = await this.getModel();
    const [document, notFound] = await of(Model.findById(id));
    if (notFound) {
      throw notFound;
    }
    if (!document) {
      return undefined;
    }
    return this.serializer.data(document).getData();
  }
  public async create(document: object): Promise<object> {
    const Model = await this.getModel();
    const record = new Model(document);
    const [savedDocument, notCreated] = await of(record.save());
    if (notCreated) {
      throw notCreated;
    }
    return this.serializer.data(savedDocument).getData();
  }
}

export { ModelBasic };
