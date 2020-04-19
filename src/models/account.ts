import { Vicis } from "vicis";
import { cast, rename, serializable, serialize } from "@vicis/decorators";

import { ModelBasic } from "./basic";

class SerializedBasic {
  public constructor(model: object) {
    Object.assign(this, model);
  }
  public toJSON(): object {
    return this;
  }
}

@serializable()
class SerializedAccount extends SerializedBasic {
  @serialize()
  public id: string;
  @rename("login")
  public UserName: string;
  @rename("first_name")
  public FirstName: string;
  @rename("last_name")
  public LastName: string;
  @cast(Vicis.INTEGER)
  @rename("age")
  public Age: string;
}

class ModelAccount extends ModelBasic {
  public constructor(name: string, schema: object, serialization: object) {
    super(name, schema, serialization);
  }
  public async readByIdAsJSON(id: string): Promise<object> {
    return new SerializedAccount(await this.readById(id)).toJSON();
  }
  public async readAllAsJSON(): Promise<object[]> {
    const accounts = await this.readAll();
    return accounts.map((account) => new SerializedAccount(account).toJSON());
  }
}

const modelAccount = new ModelAccount("account", {}, {});

export { modelAccount };
