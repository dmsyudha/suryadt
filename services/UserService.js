const User = require('../models/User');
const moment = require('moment');

exports.createUser = async (userData) => {
  // Validate using timezone, it automatically adjusts for daylight saving time
  if (!moment.tz.zone(userData.time_zone)) {
    throw new Error('Invalid timezone');
  }

  // Validate unique email
  if (!userData.email.includes('@')) {
    throw new Error('Invalid email');
  }

  const user = await User.create(userData);
  return user;
};

exports.deleteUser = async (id) => {
  await User.destroy({ where: { id: id } });
};

exports.updateUser = async (id, userData) => {
  if (userData.time_zone) {
    validateTimeZone(userData.time_zone);
  }
  if (userData.email) {
    validateEmail(userData.email);
    await checkEmailInUse(userData.email, id);
  }

  const user = await User.update(userData, {
    where: {
      id: id
    }
  });

  if (!user[0]) {
    throw new Error('User not found');
  }

  return user;
};
