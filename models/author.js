
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    biography: DataTypes.TEXT,
  }, {});
  Author.associate = function (models) {
    Author.hasMany(models.Book);
  };
  return Author;
};
