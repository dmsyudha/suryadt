const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    birthday: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    location: {
        type: Sequelize.STRING,
        allowNull: false
    },
    time_zone: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;
