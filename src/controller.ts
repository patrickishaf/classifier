import { Request, Response } from 'express';
import { createErrorResponse, createSuccessResponse } from './util';
import service from './service';

const controller = {
  async classify(req: Request, res: Response) {
    const name = req.query.name as string;
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
  }
};

export default controller;