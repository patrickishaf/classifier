import { IPaginateParams, IWithPagination } from "knex-paginate";
import getDB from "./db";
import { Filter, GetAllProfilesOptions, Sort } from "./dto";
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

  async findProfiles(where: GetAllProfilesOptions) {
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

  async queryProfiles(filters: Filter = {}, sort: Sort = {}, pagination: IPaginateParams = { perPage: 10, currentPage: 1 }) {
    const query = db.select('*').from(tableName).where((builder) => {
      if (filters.age_group) builder.where({ age_group: filters.age_group });
      if (filters.gender) builder.where({ gender: filters.gender });
      if (filters.country_id) builder.where({ country_id: filters.country_id });
      if (filters.min_age) builder.where('age', '>=', filters.min_age);
      if (filters.max_age) builder.where('age', '<=', filters.max_age);
      if (filters.min_country_probability) builder.where('country_probability', '>=', filters.min_country_probability);
      if (filters.min_gender_probability) builder.where('gender_probability', '>=', filters.min_gender_probability);

      if (sort.column) builder.orderBy(sort.column, sort.order);
    });

    let profiles;
    try {
      profiles = await query.paginate(pagination);
    } catch (err) {
      throw this.handleSQLError(err);
    }
    if (!profiles) {
      return null;
    }
    return profiles;
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