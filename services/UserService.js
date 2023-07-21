const User = require('../models/User');
const moment = require('moment');

// Function to validate timezone
const validateTimeZone = (timeZone) => {
  if (!moment.tz.zone(timeZone)) {
    throw new Error('Invalid timezone');
  }
}

// Function to validate email
const validateEmail = (email) => {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
}

// Function to check if email is already in use
const checkEmailInUse = async (email, id) => {
  const existingUser = await User.findOne({ where: { email: email } });
  if (existingUser && existingUser.id !== id) {
    throw new Error('Email already in use');
  }
}

exports.createUser = async (userData) => {
  validateTimeZone(userData.time_zone);
  validateEmail(userData.email);
  await checkEmailInUse(userData.email);

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
