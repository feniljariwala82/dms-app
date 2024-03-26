const AuthService = require("../../services/AuthService");

/**
 * @description checks request authentication
 */
const guest = async (req, res, next) => {
  // bearer token
  const bearerToken = req.headers.authorization; // get token from request header

  // if token not found
  if (!bearerToken) {
    // then allowing the request
    return next();
  }

  // fetching token from the bearer token
  const token = bearerToken.replace("Bearer ", "");

  try {
    // verifying the token
    await AuthService.verify(token);

    // if user is logged in user then not allowing it to continue with the request
    return res.status(400).json("Unauthorized");
  } catch (error) {
    // if login check fails then an only allowing the user to continue
    // basically making sure the user is the guest one, not logged in one!
    next();
  }
};

module.exports = guest;
