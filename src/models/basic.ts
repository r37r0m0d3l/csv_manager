import * as mongoose from "mongoose";
import { Vicis } from "vicis";
import { of } from "@r37r0m0d3l/of";

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
  protected async getConnection(): Promise<Readonly<mongoose.connection>> {
    return serviceDatabase.getConnection();
  }
  public async readAll(): Promise<object[]> {
    const [documents, notFound] = await of(serviceDatabase.models[this.getName()].find());
    if (notFound) {
      throw notFound;
    }
    return this.serializer.fromArray(documents);
  }
  public async readById(id: string): Promise<object> {
    const [document, notFound] = await of(serviceDatabase.models[this.getName()].findById(id));
    if (notFound) {
      throw notFound;
    }
    if (!document) {
      return undefined;
    }
    return this.serializer.data(document).getData();
  }
  public async create(document: object): Promise<object> {
    const Model = serviceDatabase.models[this.getName()];
    const model = new Model(document);
    const [savedDocument, notCreated] = await of(model.save());
    if (notCreated) {
      throw notCreated;
    }
    return this.serializer.data(savedDocument).getData();
  }
}

export { ModelBasic };
