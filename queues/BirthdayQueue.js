// BirthdayQueue.js
const Queue = require('bull');
const EmailService = require('../services/EmailService');

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
};

const birthdayQueue = new Queue('birthday greetings', redisConfig);

birthdayQueue.process(async (job, done) => {
  try {
    const result = await EmailService.sendBirthdayEmail(job.data.user);
    done(null, result);
  } catch (err) {
    done(err);
  }
});

birthdayQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
});

birthdayQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting.`);
});

birthdayQueue.on('failed', (job, err) => {
  console.log(`Job failed with error ${err}`);
});

birthdayQueue.on('error', (error) => {
  console.log(`An error occured: ${error.message}`);
});


module.exports = birthdayQueue;
