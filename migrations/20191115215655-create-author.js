
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Authors', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      type: Sequelize.STRING(32),
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING(32),
      allowNull: false,
    },
    biography: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Authors'),
};
