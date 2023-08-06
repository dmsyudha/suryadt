const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/user");
const cron = require("node-cron");
const BirthdayService = require("./services/BirthdayService");
const birthdayQueue = require("./queues/BirthdayQueue");
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Create Express application
const app = express();

// Setup middleware to parse JSON
app.use(express.json());

// Register the user routes
app.use(userRoutes);

// Connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Run cron job to schedule birthday emails
cron.schedule("0 * * * *", () => {
  console.log("running cron job");
  BirthdayService.scheduleBirthdayEmails();
});

// Run cron job to cleanup the queue every day at 03:00 AM
const cleanupQueue = async (queue, jobType, age) => {
  console.log(`Cleaning up ${jobType} jobs...`);
  await queue.clean(age, jobType);
};

cron.schedule("0 3 * * *", async () => {
  const age = 86400000; // 24 hours in milliseconds
  const jobTypes = ["completed", "failed", "delayed", "active"];

  for (let jobType of jobTypes) {
    await cleanupQueue(birthdayQueue, jobType, age);
  }
});

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start ApolloServer before applying middleware
server.start().then(() => {
  server.applyMiddleware({ app });

  // Start Express application
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});