export type AgeGroup = 'child' | 'teenager' | 'adult' | 'senior';

export type AgifyAPIRes = {
  count: number;
  name: string;
  age: number;
}

export type Filter = {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
  min_gender_probability?: number;
  min_country_probability?: number;
}

export type NaturalLanguageFilters = {
  age_group?: AgeGroup;
  age_groups?: AgeGroup[];
  country_id?: string;
  country_ids?: string[];
  gender?: 'male' | 'female';
  genders?: Array<'male' | 'female'>;
  min_age?: number;
  max_age?: number;

  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: SortOrder;
}

export type GenderizeAPIRes = {
  count: number;
  name: string;
  gender: string;
  probability: number;
}

export type GetAllProfilesOptions = {
  gender?: string;
  country_id?: string;
  age_group?: string;
  max_age?: number;
  min_age?: number;
  min_country_probability?: number;
  min_gender_probability?: number;
  sort_by?: 'age' | 'created_at' | 'gender_probability';
  sort_order?: SortOrder;
  page?: number;
  limit?: number;
}

export type NationalizeAPIRes = {
  count: number;
  name: string;
  country: Array<{ country_id: string; probability: number }>;
}

export type ServiceResponse<T> = {
  statusCode: number;
  message?: string;
  error?: Error;
  data?: T;
}

export type Sort = {
  column?: 'age' | 'created_at' | 'gender_probability';
  order?: SortOrder;
}

export type SortOrder = 'asc' | 'desc' | 'ASC' | 'DESC';

export type SuccessResponse = {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: 'child' | 'teenager' | 'adult' | 'senior';
  country_id: string;
  country_probability: number;
  created_at: string;
}
