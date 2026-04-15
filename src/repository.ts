import getDB from "./db";
import { Model, ProfileRecord } from "./models";

const tableName = 'profiles';
const db = getDB();

const repository = {
  handleSQLError(err: any) {
    if (err.sqlMessage) {
      return new Error(err.sqlMessage);
    }
    return err as Error;
  },

  async findProfileByName(name: string): Promise<Model<ProfileRecord> | null> {
    let profile: Model<ProfileRecord>;
    try {
      profile = await db.select("*").from(tableName).where("name", name).first();
    } catch (err) {
      throw this.handleSQLError(err);
    }
    if (!profile) {
      return null;
    }
    return profile;
  },

  async saveProfile(profile: ProfileRecord): Promise<number> {
    try {
      const [id] = await (db.insert(profile).into(tableName));
      return id;
    } catch(err: any) {
      throw this.handleSQLError(err);
    }
  },
};

export default repository;