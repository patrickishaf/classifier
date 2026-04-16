import agifyAPI from "./apis/agify-api";
import genderizeAPI from "./apis/genderize-api";
import nationalizeAPI from "./apis/nationalize-api";
import { AgifyAPIRes, GenderizeAPIRes, GetAllProfilesOptions, NationalizeAPIRes, ServiceResponse, SuccessResponse } from "./dto";
import { Model, ProfileRecord } from "./models";
import { v7 as uuidv7 } from "uuid";
import repository from "./repository";

const service = {
  async profileName(name: string): Promise<ServiceResponse<any>> {
    /**
     * Call all three APIs using the provided name and aggregate the responses
     * Extract gender, gender_probability, and count from Genderize. Rename count to sample_size
     * Extract age from Agify. Classify age_group: 0–12 → child, 13–19 → teenager, 20–59 → adult, 60+ → senior
     * Extract country list from Nationalize. Pick the country with the highest probability as country_id
     * Store the processed result with a UUID v7 id and UTC created_at timestamp
     */
    const existingProfile = await repository.findProfileByName(name);
    if (existingProfile) {
      const response: SuccessResponse = {
        id: existingProfile.id,
        name: existingProfile.name,
        gender: existingProfile.gender,
        gender_probability: existingProfile.gender_probability,
        sample_size: existingProfile.sample_size,
        age: existingProfile.age,
        age_group: existingProfile.age_group,
        country_id: existingProfile.country_id,
        country_probability: existingProfile.country_probability,
        created_at: new Date(existingProfile.created_at).toISOString(),
      };
      return ({
        statusCode: 200,
        message: 'Profile already exists',
        data: response,
      });
    }

    const profile: Partial<Model<ProfileRecord>> = {
      name,
    };

    let genderData!: GenderizeAPIRes, ageData!: AgifyAPIRes, nationalityData!: NationalizeAPIRes;

    try {
      genderData = await genderizeAPI.classifyName(name);
      ageData = await agifyAPI.classifyName(name);
      nationalityData = await nationalizeAPI.classifyName(name);
    } catch (err: any) {
      const errorMessage = err.message as string;
      if (errorMessage.startsWith('getaddrinfo ENOTFOUND')) {
        return {
          statusCode: 502,
          error: new Error(errorMessage.split(' ')[2] + ' is temporarily unavailable'),
        }
      }
      return {
        statusCode: 502,
        error: new Error(err.message),
      }
    }

    if (genderData.gender === null || genderData.count === 0 || ageData.age === null || nationalityData.country.length === 0) {
      return {
        statusCode: 422,
        error: new Error("No prediction available for the provided name"),
      }
    }

    profile.gender = genderData.gender;
    profile.gender_probability = genderData.probability;
    profile.sample_size = genderData.count;
    profile.age = ageData.age;

    profile.age_group = serviceHelper.classifyAgeGroup(ageData.age);
    
    const { country, probability } = serviceHelper.getMostProbableCountry(nationalityData.country);
    profile.country_id = country;
    profile.country_probability = probability
    profile.id = uuidv7();

    try {
      await repository.saveProfile(profile as ProfileRecord);
    } catch (err: any) {
      return {
        statusCode: 500,
        error: new Error(err.message),
      }
    }

    const successResponse: SuccessResponse = {
      id: profile.id,
      name,
      gender: profile.gender,
      gender_probability: profile.gender_probability,
      sample_size: profile.sample_size,
      age: profile.age,
      age_group: profile.age_group,
      country_id: profile.country_id,
      country_probability: profile.country_probability,
      created_at: (new Date()).toISOString(),
    }

    return {
      statusCode: 200,
      data: successResponse,
    }
  },

  async getAllProfiles(options: GetAllProfilesOptions): Promise<ServiceResponse<any>> {
    try {
      const profiles = await repository.findAllProfiles(options);
      return {
        statusCode: 200,
        data: profiles,
      }
    } catch (err: any) {
      console.log({ getAppProfilesError: err.message });
      return {
        statusCode: 500,
        error: new Error('fai')
      }
    }
  }
};

const serviceHelper = {
  classifyAgeGroup(age: number): 'child' | 'teenager' | 'adult' | 'senior' {
    if (age < 0) throw new Error("invalid age");

    if (age <= 12) return 'child';

    if (age <= 19) return 'teenager';

    if (age <= 59) return 'adult';

    return 'senior';
  },

  getMostProbableCountry(countries: Array<{ country_id: string; probability: number }>): { country: string; probability: number } {
    let country: string = '', probability: number = 0;

    countries.forEach(c => {
      if (c.probability > probability) {
        country = c.country_id;
        probability = c.probability;
      }
    });

    return ({ country, probability });
  }
}

export default service;