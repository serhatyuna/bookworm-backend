
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      userRole: DataTypes.BOOLEAN,
    },
    {},
  );
  User.associate = function (models) {
    User.hasMany(models.Favorite);
    User.hasMany(models.Review);
    User.hasMany(models.Like);
  };
  return User;
};
