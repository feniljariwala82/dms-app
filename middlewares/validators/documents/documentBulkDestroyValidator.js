const yup = require("yup");
const parseValidationErrors = require("../../../utils/parseValidationErrors");

// document ids schema
const documentIdsSchema = yup.object({
  ids: yup
    .array()
    .of(
      yup.string("Each id should be a string").required("Id is required").trim()
    )
    .required("Ids are required"),
});

// document bulk destroyer validator
const documentBulkDestroyValidator = async (req, res, next) => {
  try {
    // validate form body
    const data = await documentIdsSchema.validate(req.body, {
      abortEarly: false,
    });

    // updating sanitized form body data
    req.body = data;

    // continue on validation succedes
    next();
  } catch (error) {
    console.error(error);
    return res.status(422).json({ errors: parseValidationErrors(error) });
  }
};

module.exports = documentBulkDestroyValidator;
