// BirthdayService.js
const sequelize = require('../config/database');
const User = require('../models/User');
const birthdayQueue = require('../queues/BirthdayQueue');

exports.scheduleBirthdayEmails = async () => {
  console.log('finding users')
  const users = await User.findAll({
    where: {
      birthday: sequelize.literal(`date_part('month', birthday) = date_part('month', CURRENT_DATE) AND date_part('day', birthday) = date_part('day', CURRENT_DATE)`)
    }
  });

  users.forEach(user => {
    birthdayQueue.add({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  });
  if(users){
    console.log('User found',users)
  }
};
