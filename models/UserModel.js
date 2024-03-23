const UserException = require("../exceptions/UserException");
const User = require("../schemas/usersSchema");
const PasswordHasher = require("../services/PasswordHasher");

class UserModel {
  /**
   * @description saves user
   * @param {{email:string, password:string, firstName:string, lastName:string}} payload
   */
  static store = async (payload) => {
    const { email, password, firstName, lastName } = payload;

    // checking user existence
    const exists = await User.findOne({ email });
    if (exists) {
      throw UserException("User already exists with this email", "USER_ERROR");
    }

    // creating user
    await User.create({
      email,
      firstName,
      lastName,
      password: await PasswordHasher.hash(password),
    });
  };

  /**
   * @description gets by email or fails
   * @param {string} email
   * @returns
   */
  static getByEmailOrFail = async (email) => {
    // checking user existence
    const user = await User.findOne({ email });

    // if not exists then throwing an error
    if (!user) {
      throw UserException("User does not exist", "USER_ERROR");
    }

    return user;
  };
}

module.exports = UserModel;
