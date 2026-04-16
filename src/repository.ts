import getDB from "./db";
import { GetAllProfilesOptions } from "./dto";
import { Model, ProfileRecord } from "./models";

const tableName = 'profiles';
const db = getDB();

const repository = {
  async deleteProfile(id: string) {
    try {
      const deletedID = await db(tableName).where({ id }).delete();
      return deletedID;
    } catch (err) {
      throw this.handleSQLError(err);
    }
  },

  async findAllProfiles(where: GetAllProfilesOptions) {
    let profiles: Model<ProfileRecord>[];
    try {
      profiles = await db.columns('id', 'name', 'gender', 'age', 'age_group', 'country_id').select().from(tableName).where(where);
    } catch (err) {
      throw this.handleSQLError(err);
    }
    if (!profiles) {
      return null;
    }
    return profiles;
  },

  async findProfileByID(id: string): Promise<Model<ProfileRecord> | null> {
    let profile: Model<ProfileRecord>;
    try {
      profile = await db.select("*").from(tableName).where("id", id).first();
    } catch (err) {
      throw this.handleSQLError(err);
    }
    if (!profile) {
      return null;
    }
    return profile;
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

  handleSQLError(err: any) {
    if (err.sqlMessage) {
      return new Error(err.sqlMessage);
    }
    return err as Error;
  },
};

export default repository;