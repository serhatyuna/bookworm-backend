
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    content: DataTypes.TEXT,
    userID: DataTypes.INTEGER,
    bookID: DataTypes.INTEGER,
  }, {});
  Review.associate = function (models) {
    Review.belongsTo(models.Book);
    Review.belongsTo(models.User);
    Review.hasMany(models.Like);
  };
  return Review;
};
