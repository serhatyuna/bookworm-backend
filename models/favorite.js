
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    bookID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
  }, {});
  Favorite.associate = function (models) {
    Favorite.belongsTo(models.Book);
    Favorite.belongsTo(models.User);
  };
  return Favorite;
};
