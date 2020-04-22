import { Vicis } from "vicis";
import { Serialize, cast, rename, serialize } from "@vicis/decorators";

import { ModelBasic } from "./basic";

@Serialize()
class SerializedBasic {
  public constructor(model: object) {
    Object.assign(this, model);
  }
  public asJSON(): object {
    return JSON.parse(JSON.stringify(this));
  }
}

@Serialize()
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
    return new SerializedAccount(await this.readById(id)).asJSON();
  }
  public async readAllAsJSON(): Promise<object[]> {
    const accounts = await this.readAll();
    return accounts.map((account) => new SerializedAccount(account).asJSON());
  }
}

const modelAccount = new ModelAccount("account", {}, {});

export { modelAccount };
