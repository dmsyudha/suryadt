const sequelize = require('../configs/database');
const User = require('../models/User');
const birthdayQueue = require('../queues/BirthdayQueue');

class BirthdayService {
  constructor() {}

  async getUsersHavingBirthdayToday() {
    return User.findAll({
      where: {
        birthday: sequelize.literal(`date_part('month', birthday) = date_part('month', NOW() AT TIME ZONE time_zone) 
        AND date_part('day', birthday) = date_part('day', NOW() AT TIME ZONE time_zone) 
        AND date_part('hour', NOW() AT TIME ZONE time_zone) = 9`)
      }
    });  
  }

  constructJobId(user, now) {
    return `${user.email}-${now.toISOString().slice(0,10)}`;
  }

  async scheduleBirthdayEmails() {
    // Get current date and time
    const now = new Date();
    const users = await this.getUsersHavingBirthdayToday();

    for (let user of users) {
      const jobId = this.constructJobId(user, now);
      
      // Check if a job with the same jobId already exists
      const existingJob = await birthdayQueue.getJob(jobId);

      if(existingJob) {
        console.log(`Job ID: ${jobId} already exists and will be ignored.`);
        continue;
      }

      try {
        // If a job does not already exist, then add it to the queue
        const job = await birthdayQueue.add(
          {
            event: 'birthday',
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            },
          },
          {
            jobId,
            attempts: 3, 
            backoff: {
              type: 'exponential',
              delay: 5000
            }
          }
        );
      
        // Log the user's first name and the jobId
        console.log(`User's first name: ${user.firstName}`);
        console.log(`Added Job ID: ${job.id}`);
      } catch(err) {
        console.error(`Failed to add Job ID: ${jobId}`);
        console.error(err);
      }
    }
  }
}

module.exports = new BirthdayService();
