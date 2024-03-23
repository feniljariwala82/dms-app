/**
 * @description logs error and generates user understandable messages
 * @param {Error} error
 * @param {string} defaultMessage
 */
const logError = (error, defaultMessage) => {
  // checking if the error is user generated
  if (error.code === "USER_ERROR") {
    // then directly returning the error message
    return error.message;
  } else {
    // only logging auto generated errors
    // logs error, also we can add our sentry kind of logger too
    console.error(error);

    // otherwise showing user understandable message
    return defaultMessage;
  }
};

module.exports = logError;
