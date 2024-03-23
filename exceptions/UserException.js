/**
 * @description generates error with custom code
 * @param {string} errorMessage
 * @param {'USER_ERROR'|'INVALID_INPUT'} code
 * @returns
 */
const UserException = (errorMessage, code = "USER_ERROR") => {
  // Throw an error with specific message and error code
  const error = new Error(errorMessage);
  error.code = code;
  return error;
};

module.exports = UserException;
