const bcrypt = require("bcrypt");

class PasswordHasher {
  /** Salt rounds */
  static saltRounds = 12;

  /**
   * @description hashes the password
   * @param {string} plainPassword
   */
  static hash = async (plainPassword) => {
    const hash = await bcrypt.hash(plainPassword, this.saltRounds);
    return hash;
  };

  /**
   * @description compares hashed and plain passwords
   * @param {string} hashedPassword
   * @param {string} plainPassword
   */
  static compare = async (hashedPassword, plainPassword) => {
    const valid = await bcrypt.compare(plainPassword, hashedPassword);
    return valid;
  };
}

module.exports = PasswordHasher;
