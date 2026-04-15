export type Model<T> = T & {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type ProfileRecord = {
  name: string;
  gender: string;
  gender_probability: number;
  sample_size: number;
  age: number;
  age_group: 'child' | 'teenager' | 'adult' | 'senior';
  country_id: string;
  country_probability: number;
}