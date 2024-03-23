// parses validation errors
const parseValidationErrors = (validationError) => {
  // error object
  const errorMessages = {};

  // iterates over inner error instance and generates error object
  validationError.inner.forEach((innerInstance) => {
    errorMessages[innerInstance.path] = innerInstance.message;
  });

  return errorMessages;
};

module.exports = parseValidationErrors;
