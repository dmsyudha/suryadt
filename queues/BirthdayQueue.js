const Queue = require('bull');
const EmailService = require('../services/EmailService');
const cron = require('node-cron');

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
};

birthdayQueue.process(async (job, done) => {
  try {
    const event = job.data.event;
    const subject = eventMessages[event].subject;
    const messageTemplate = eventMessages[event].messageTemplate;
    const result = await EmailService.sendMessage(job.data.user, subject, messageTemplate);
    if(result !== 200) {
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

// Clear jobs every 
const cleanupQueue = async (queue, jobType, age) => {
  console.log(`Cleaning up ${jobType} jobs...`);
  await queue.clean(age, jobType);
}

// Clear completed, pending and failed jobs every two days at 03:00 AM
cron.schedule('0 3 * * *', async () => {
  const age = 86400000; // 24 hours in milliseconds
  const jobTypes = ['completed', 'failed', 'delayed', 'active'];
  
  for (let jobType of jobTypes) {
    await cleanupQueue(birthdayQueue, jobType, age);
  }
});


module.exports = birthdayQueue;
