const yup = require("yup");
const parseValidationErrors = require("../../../utils/parseValidationErrors");

// login schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide valid email")
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password should be at least 8 characters long")
    .trim(),
});

// login validator
const loginValidator = async (req, res, next) => {
  try {
    // validate form body
    const data = await loginSchema.validate(req.body, { abortEarly: false });

    // updating sanitized form body data
    req.body = data;

    // continue on validation succedes
    next();
  } catch (error) {
    console.error(error);
    return res.status(422).json({ errors: parseValidationErrors(error) });
  }
};

module.exports = loginValidator;
