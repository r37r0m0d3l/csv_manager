import { ModelBasic } from "./basic";

class ModelAccount extends ModelBasic {
  public constructor(name: string, schema: object, serialization: object) {
    super(name, schema, serialization);
  }
}

const modelAccount = new ModelAccount("account", {}, {});

export { modelAccount };
