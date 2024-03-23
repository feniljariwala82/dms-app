const UserModel = require("../models/UserModel");
const path = require("path");
const fs = require("fs");

const privateKey = fs.readFileSync(
  path.join(__dirname, "..", "keys", "private.pem")
);

class AuthService {
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
  };

  static login = async () => {};
}

module.exports = AuthService;
