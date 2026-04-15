export const createSuccessResponse = (data: any, message?: string) => ({
  status: 'success',
  data,
  message,
});

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