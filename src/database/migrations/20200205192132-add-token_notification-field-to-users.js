module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'token_notification', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'token_notification');
  },
};
