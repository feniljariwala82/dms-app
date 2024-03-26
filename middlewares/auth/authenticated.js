const AuthService = require("../../services/AuthService");
const { getBlacklist } = require("../../config/blacklist");

/**
 * @description checks request authentication
 */
const authenticated = async (req, res, next) => {
  // bearer token
  const bearerToken = req.headers.authorization; // get token from request header

  // checking for blacklisted or not
  if (getBlacklist().some((token) => token === bearerToken)) {
    return res.status(401).json("Token revoked. Please login again.");
  }

  // if token not found
  if (!bearerToken) {
    // then throwing an error
    return res.status(401).json("Unauthenticated");
  }

  // fetching token from the bearer token
  const token = bearerToken.replace("Bearer ", "");

  try {
    // verifying the token
    const user = await AuthService.verify(token);

    // assigning decoded user to request
    req.user = user;

    // assigning the token
    req.authToken = bearerToken;

    // following next requests
    return next();
  } catch (error) {
    // if failed throwing an error
    return res.status(401).json("Unauthenticated");
  }
};

module.exports = authenticated;
