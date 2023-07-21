// BirthdayQueue.js
const Queue = require('bull');
const EmailService = require('../services/EmailService');

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
};

const birthdayQueue = new Queue('greetings', redisConfig);

const eventMessages = {
  birthday: {
    subject: 'Happy Birthday!',
    messageTemplate: 'Hey, {firstName} {lastName}, happy birthday!'
  }
  // We can add more events here
  // It also can use different files config if necessary
};

birthdayQueue.process(async (job, done) => {
  try {
    const event = job.data.event;
    const subject = eventMessages[event].subject;
    const messageTemplate = eventMessages[event].messageTemplate;
    const result = await EmailService.sendMessage(job.data.user, subject, messageTemplate);
    if(result.status !== 200) {
      throw new Error('Response code was not 200');
    }
    done(null, result);
  } catch (err) {
    done(err);
  }
});

birthdayQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result ${result}`);
});

birthdayQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting.`);
});

birthdayQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error ${err}`);
});

birthdayQueue.on('error', (error) => {
  console.log(`An error occurred: ${error.message}`);
});

module.exports = birthdayQueue;
