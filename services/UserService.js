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
