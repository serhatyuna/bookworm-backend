
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'Book',
    {
      isbn: DataTypes.STRING(15),
      title: DataTypes.STRING(255),
      description: DataTypes.TEXT,
      cover: DataTypes.STRING(255),
      releasedYear: DataTypes.INTEGER(4),
      language: DataTypes.STRING(32),
      pageNumber: DataTypes.INTEGER(5),
      authorID: DataTypes.INTEGER,
      genreID: DataTypes.INTEGER,
    },
    {},
  );
  Book.associate = function (models) {
    Book.belongsTo(models.Genre);
    Book.belongsTo(models.Author, {
      onDelete: 'CASCADE',
      hooks: true,
    });
    Book.hasMany(models.Favorite);
    Book.hasMany(models.Review);
  };
  return Book;
};
