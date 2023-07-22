"use strict";
const { faker } = require("@faker-js/faker");
const moment = require("moment-timezone");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timeZones = moment.tz.names();
    const today = new Date();

    let users = timeZones.map((timeZone) => {
      const year = faker.number.int({ min: 1992, max: 2000 });
      const birthday = new Date(year, today.getMonth(), today.getDate());

      return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        birthday: birthday,
        location: faker.location.country(),
        time_zone: timeZone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return queryInterface.bulkInsert("users", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
