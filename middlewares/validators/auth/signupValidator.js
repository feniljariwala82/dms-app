const yup = require("yup");
const parseValidationErrors = require("../../../utils/parseValidationErrors");

// signup schema
const signupSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide valid email")
    .trim(),
  firstName: yup
    .string()
    .required("First name is required")
    .max(50, "First name can not be longer than 50 characters")
    .trim(),
  lastName: yup
    .string()
    .required("Last name is required")
    .max(50, "Last name can not be longer than 50 characters")
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password should be at least 8 characters long")
    .trim(),
});

// signup validator
const signupValidator = async (req, res, next) => {
  try {
    // validate form body
    const data = await signupSchema.validate(req.body, { abortEarly: false });

    // updating sanitized form body data
    req.body = data;

    // continue on validation succedes
    next();
  } catch (error) {
    console.error(error);
    return res.status(422).json(parseValidationErrors(error));
  }
};

module.exports = signupValidator;
