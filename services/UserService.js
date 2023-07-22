const User = require("../models/User");
const moment = require("moment");

class UserService {
  constructor() {}

  validateTimeZone(timeZone) {
    if (!moment.tz.zone(timeZone)) {
      throw new Error("Invalid timezone");
    }
  }

  validateEmail(email) {
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }
  }

  async checkEmailInUse(email, id) {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser && existingUser.id !== id) {
      throw new Error("Email already in use");
    }
  }

  async createUser(userData) {
    this.validateTimeZone(userData.time_zone);
    this.validateEmail(userData.email);
    await this.checkEmailInUse(userData.email);

    const user = await User.create(userData);
    return user;
  }

  async deleteUser(id) {
    await User.destroy({ where: { id: id } });
  }

  async updateUser(id, userData) {
    if (userData.time_zone) {
      this.validateTimeZone(userData.time_zone);
    }
    if (userData.email) {
      this.validateEmail(userData.email);
      await this.checkEmailInUse(userData.email, id);
    }

    const user = await User.update(userData, {
      where: {
        id: id,
      },
    });

    if (!user[0]) {
      throw new Error("User not found");
    }

    return user;
  }
}

module.exports = new UserService();
