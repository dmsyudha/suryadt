const User = require('./models/User');

module.exports = {
  Query: {
    users: () => User.findAll(),
    user: (_, { id }) => User.findOne({ where: { id } }),
  },
  Mutation: {
    createUser: (_, { firstName, lastName, email, birthday, location }) => User.create({ firstName, lastName, email, birthday, location }),
    updateUser: async (_, { id, firstName, lastName, email, birthday, location }) => {
      await User.update({ firstName, lastName, email, birthday, location }, { where: { id } });
      return User.findOne({ where: { id } });
    },
    deleteUser: async (_, { id }) => {
      await User.destroy({ where: { id } });
      return true;
    }
  }
};
