
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    isbn: {
      type: Sequelize.STRING(15),
      allowNull: false,
      unique: true,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    cover: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    releasedYear: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    language: {
      type: Sequelize.STRING(32),
      allowNull: false,
    },
    pageNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    authorID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    genreID: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Books'),
};
