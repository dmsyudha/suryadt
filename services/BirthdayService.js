// BirthdayService.js
const sequelize = require('../config/database');
const User = require('../models/User');
const birthdayQueue = require('../queues/BirthdayQueue');

exports.scheduleBirthdayEmails = async () => {
  console.log('Finding users');

  // Get current date and time
  const now = new Date();

  const users = await User.findAll({
    where: {
      birthday: sequelize.literal(`date_part('month', birthday) = date_part('month', NOW() AT TIME ZONE time_zone) 
      AND date_part('day', birthday) = date_part('day', NOW() AT TIME ZONE time_zone) 
      AND date_part('hour', NOW() AT TIME ZONE time_zone) = 9`)
    }
  });  

  // Fetch jobs which are in 'waiting' or 'active' state
  const existingJobs = await birthdayQueue.getJobs(['waiting', 'active', 'delayed']);

  users.forEach(user => {
    // Construct a unique jobId using the user's email and the current date
    const jobId = `${user.email}-${now.toISOString().slice(0,10)}`;
  
    // If a job does not already exist, then add it to the queue
    birthdayQueue.add(
      {
        event: 'birthday',
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
      },
      {
        jobId,  // Here's where we include the unique jobId
        attempts: 3, 
        backoff: {
          type: 'exponential',
          delay: 60000
        }
      }
    );
  });
};
