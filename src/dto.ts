export type AgeGroup = 'child' | 'teenager' | 'adult' | 'senior';

export type AgifyAPIRes = {
  count: number;
  name: string;
  age: number;
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

export type SuccessResponse = {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  sample_size: number;
  age: number;
  age_group: 'child' | 'teenager' | 'adult' | 'senior';
  country_id: string;
  country_probability: number;
  created_at: string;
}
