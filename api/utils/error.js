export const errorHandler = (statuscode, message) => {
  const error = new Error();
  error.statuscode = statuscode;
  error.message = error;
  return error;
};
