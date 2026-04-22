import { Request, Response } from 'express';
import Joi from 'joi';
import { createErrorResponse, createSuccessResponse, createSuccessResponseList, createSuccessResponsePaginated, validateSchema } from './util';
import service from './service';
import { AgeGroup, GetAllProfilesOptions, SortOrder } from './dto';

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
      age_group: Joi.string().lowercase().valid('child', 'teenager', 'adult', 'senior').optional(),
      country_id: Joi.string().optional(),
      gender: Joi.string().lowercase().valid('male', 'female').optional(),
      limit: Joi.number().positive().min(1).max(50).optional(),
      max_age: Joi.number().optional(),
      min_age: Joi.number().optional(),
      min_country_probability: Joi.number().optional(),
      min_gender_probability: Joi.number().optional(),
      order: Joi.string().lowercase().valid('asc', 'desc').optional(),
      page: Joi.number().positive().min(1).optional(),
      sort_by: Joi.string().valid('age', 'created_at', 'gender_probability').optional(),
    }), req.query);
    if (errorMsg) {
      return res.status(400).json(createErrorResponse('Invalid parameters'));
    }

    const options: GetAllProfilesOptions = {};
    const { age_group, country_id, gender, limit, max_age, min_age, min_country_probability, min_gender_probability, order, page, sort_by } = req.query;

    if (age_group) options.age_group = (age_group as AgeGroup).toLowerCase();
    if (country_id) options.country_id = (country_id as string).toUpperCase();
    if (gender) options.gender = (gender as string).toLowerCase();
    if (limit) options.limit = Number(limit);
    if (max_age) options.max_age = Number(max_age);
    if (min_age) options.min_age = Number(min_age);
    if (min_country_probability) options.min_country_probability = Number(min_country_probability);
    if (min_gender_probability) options.min_gender_probability = Number(min_gender_probability);
    if (order) options.sort_order = order as SortOrder;
    if (page) options.page = Number(page);
    if (sort_by) options.sort_by = sort_by as 'age' | 'created_at' | 'gender_probability';
    
    const response = await service.getAllProfiles(options);
    if (response.error) {
      return res.status(response.statusCode).json(createErrorResponse(response.error.message));
    } else {
      return res.status(response.statusCode).json(createSuccessResponsePaginated(response.data.data, response.data.pagination ));
    }
  },

  async getSingleProfile(req: Request, res: Response) {
    const errorMsg = validateSchema(Joi.object({
      id: Joi.string().uuid().required(),
    }), req.params);
    if (errorMsg) {
      return res.status(400).json(createErrorResponse('Invalid id'));
    }

    const response = await service.getSingleProfile(req.params.id as string);
    if (response.error) {
      return res.status(response.statusCode).json(createErrorResponse(response.error.message));
    } else {
      return res.status(response.statusCode).json(createSuccessResponse(response.data));
    }
  },

  async deleteProfile(req: Request, res: Response) {
    const errorMsg = validateSchema(Joi.object({
      id: Joi.string().uuid().required(),
    }), req.params);
    if (errorMsg) {
      return res.status(400).json(createErrorResponse('Invalid id'));
    }

    const response = await service.deleteProfile(req.params.id as string);
    if (response.error) {
      return res.status(response.statusCode).json(createErrorResponse(response.error.message));
    } else {
      return res.sendStatus(response.statusCode);
    }
  },
};

export default controller;