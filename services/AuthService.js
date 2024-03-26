const UserModel = require("../models/UserModel");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const PasswordHasher = require("../services/PasswordHasher");

const privateKey = fs.readFileSync(
  path.join(__dirname, "..", "keys", "private.pem")
);

const publicKey = fs.readFileSync(
  path.join(__dirname, "..", "keys", "public.pem")
);

class AuthService {
  /**
   * @description generates JWT token
   * @param {{_id:any, email:string, firstName:string, lastName:string, createdAt:any}} payload
   * @returns
   */
  static generateJWT = async (payload) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        privateKey,
        { algorithm: "RS256", expiresIn: "1h" },
        (error, encoded) => {
          if (error) {
            return reject(new Error(error.message));
          }

          return resolve(encoded);
        }
      );
    });
  };

  /**
   * @description verifies the token
   * @param {string} token
   */
  static verify = async (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        publicKey,
        { algorithms: "RS256" },
        (error, decoded) => {
          if (error) {
            return reject(new Error(error.message));
          }
          return resolve(decoded);
        }
      );
    });
  };

  /**
   * @description checks user existence and matches password
   * @param {{email:string, password:string}} payload
   */
  static authenticate = async (payload) => {
    const { email, password } = payload;

    // checking user existence
    const user = await UserModel.getByEmailOrFail(email);

    // checks password validation
    const validPassword = await PasswordHasher.compare(user.password, password);

    // if password is not valid then throwing an error
    if (!validPassword) {
      throw UserException("Invalid credentials", "USER_ERROR");
    }

    return user;
  };

  /**
   * @description validates user and generates jwt token
   * @param {{email:string, password:string}} payload
   */
  static login = async (payload) => {
    // authenticates the user
    const user = await this.authenticate(payload);

    // generates and signs JWT token
    const token = await this.generateJWT({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    });

    return token;
  };
}

module.exports = AuthService;
