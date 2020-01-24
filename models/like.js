
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    reviewID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User);
    Like.belongsTo(models.Review);
  };
  return Like;
};
