import { Request, Response } from 'express';
import Joi from 'joi';
import { createErrorResponse, createSuccessResponse, createSuccessResponseList, validateSchema } from './util';
import service from './service';
import { AgeGroup, GetAllProfilesOptions } from './dto';

const controller = {
  async classify(req: Request, res: Response) {
    const name = req.body.name as string;
    if (!name) {
      return res.status(400).json(createErrorResponse("Missing or empty name parameter"));
    }
    if (name.length <= 0) {
      return res.status(400).json(createErrorResponse("Missing or empty name parameter"));
    }

    const isValid = /^[a-zA-Z]+$/.test(name);
    if (!isValid) {
      return res.status(422).json(createErrorResponse("name is not a string"));
    }

    const response = await service.profileName(name);
    if (response.error) {
      res.status(response.statusCode).json(createErrorResponse(response.error.message));
    } else {
      res.status(response.statusCode).json(createSuccessResponse(response.data, response.message));
    }
  },

  async getAllProfiles(req: Request, res: Response) {
    const errorMsg = validateSchema(Joi.object({
      gender: Joi.string().lowercase().valid('male', 'female').optional(),
      country_id: Joi.string().optional(),
      age_group: Joi.string().lowercase().valid('child', 'teenager', 'adult', 'senior').optional(),
    }), req.query);
    if (errorMsg) {
      return res.status(400).json(createErrorResponse('Invalid parameters'));
    }

    const options: GetAllProfilesOptions = {};
    const { gender, country_id, age_group } = req.query;

    if (gender) options.gender = (gender as string).toLowerCase();
    if (country_id) options.country_id = (country_id as string).toUpperCase();
    if (age_group) options.age_group = (age_group as AgeGroup).toLowerCase();
    
    const response = await service.getAllProfiles(options);
    if (response.error) {
      return res.status(response.statusCode).json(createErrorResponse(response.error.message));
    } else {
      return res.status(response.statusCode).json(createSuccessResponseList(response.data, response.data.length ));
    }
  },

  async getSingleProfile(req: Request, res: Response) {}
};

export default controller;