const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');
const cron = require('node-cron');
const BirthdayService = require('./services/BirthdayService');

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
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Run cron job
cron.schedule('*/5 * * * * *', () => {
  console.log("running cron job")
  BirthdayService.scheduleBirthdayEmails();
});

// Start Express application
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
