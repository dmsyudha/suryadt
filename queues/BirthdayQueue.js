const Queue = require('bull');
const EmailService = require('../services/EmailService');

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
};

const eventMessages = {
  birthday: {
    subject: 'Happy Birthday!',
    messageTemplate: 'Hey, {firstName} {lastName}, happy birthday!'
  }
};

class BirthdayQueue {
  constructor() {
    this.queue = new Queue('greetings', redisConfig);

    this.queue.process(async (job, done) => {
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

    this.queue.on('completed', (job, result) => {
      console.log(`Job ${job.id} completed with result ${result}`);
    });

    this.queue.on('waiting', (jobId) => {
      console.log(`Job ${jobId} is waiting.`);
    });

    this.queue.on('failed', (job, err) => {
      console.log(`Job ${job.id} failed with error ${err}`);
    });

    this.queue.on('error', (error) => {
      console.log(`An error occurred: ${error.message}`);
    });
    
    this.queue.on('retrying', (job, err) => {
      console.log(`Job ${job.id} is being retried due to ${err}`);
    });
  }

  getQueue() {
    return this.queue;
  }
}

module.exports = new BirthdayQueue().getQueue();
