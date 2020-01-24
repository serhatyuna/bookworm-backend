
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    event: DataTypes.STRING,
    userID: DataTypes.INTEGER,
  }, {});
  Log.associate = function (models) {
    Log.belongsTo(models.User);
  };
  return Log;
};
