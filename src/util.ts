import Joi from 'joi';

export const createSuccessResponse = (data: any, message?: string) => ({
  status: 'success',
  data,
  message,
});

export const createSuccessResponseList = (data: any, count: number) => ({
  status: 'success',
  count,
  data,
})

export const createErrorResponse = (message: string) => ({
  status: 'error',
  message,
});

export const handleException = (err) => {
  console.log('unhandled exception:', err);
}

export const handleRejection = (err) => {
  console.log('unhandled exception:', err);
}

export const validateSchema = (schema: Joi.Schema<any>, data: any) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    const message = error.details
      .map((detail: any) => detail.message.replace(/\\/g, ''))
      .join("; ");
    return message.split(";")[0].replace('"', '').replace('"', '');
  }
};