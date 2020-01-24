const Sequelize = require('sequelize');
const {
  sequelize, Genre, Book, Author, Log,
} = require('../models');

exports.getAllGenres = (req, res) => {
  sequelize.query('SELECT g.id as id, g.type as type, g.createdAt as createdAt, IFNULL(b.number_of_books, 0) as number_of_books FROM genres g LEFT JOIN (SELECT genreID, COUNT(*) number_of_books FROM books GROUP BY genreID) b ON g.id = b.genreID ORDER BY type ASC', {
    type: sequelize.QueryTypes.SELECT,
  })
    .then((genres) => {
      if (genres) {
        res.status(200).json({
          status: true,
          genres,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'No genre in the database!',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error || 'A database error occurred.',
      });
    });
};

exports.getMostPopularGenre = async (req, res) => {
  try {
    const genre = await sequelize.query(`SELECT genreID as id, genres.type FROM ((SELECT b.id, b.title, g.id genreID, g.type, f.countOfFavorites c, SUM(f.countOfFavorites) s FROM genres g INNER JOIN books b ON g.id = b.genreID INNER JOIN (SELECT bookID, COUNT(*) countOfFavorites FROM favorites GROUP BY bookID) f ON b.id = f.bookID GROUP BY genreID ORDER BY s DESC)
    UNION
    (SELECT b.id, b.title, g.id genreID, g.type, r.countOfReviews c, SUM(r.countOfReviews) s FROM genres g INNER JOIN books b ON g.id = b.genreID INNER JOIN (SELECT bookID, COUNT(*) countOfReviews FROM reviews GROUP BY bookID) r ON b.id = r.bookID GROUP BY genreID ORDER BY s DESC)) x INNER JOIN genres ON x.genreID = genres.id GROUP BY genreID ORDER BY SUM(s) DESC LIMIT 1`, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (genre) {
      res.status(200).json({
        status: true,
        genre: genre[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'No genre is popular.',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getGenreById = (req, res) => {
  Genre.findByPk(req.params.id, {
    attributes: ['id', 'type'],
  })
    .then((genre) => {
      if (genre) {
        const plainData = genre.get({ plain: true });
        res.status(200).json({
          status: true,
          genre: plainData,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'Genre does not exist!',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error || 'A database error occurred.',
      });
    });
};

exports.getBooksOfGenre = (req, res) => {
  Book.findAll({
    attributes: ['id', 'title', 'cover'],
    where: {
      genreID: req.params.id,
    },
    include: [{
      model: Author,
    }],
  })
    .then((books) => {
      if (books) {
        const plainData = books.map((book) => book.get({ plain: true }));
        const arrayOfBooks = Object.values(plainData);
        res.status(200).json({
          status: true,
          books: arrayOfBooks,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'There is no book of this genre!',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error || 'A database error occurred.',
      });
    });
};

exports.createGenre = (req, res) => {
  const genre = { type: req.body.type };
  Genre.create(genre)
    .then((newGenre) => {
      const plainData = newGenre.get({ plain: true });
      Log.create({
        event: `created a genre (${plainData.id}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        ...plainData,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error || 'A database error occurred.',
      });
    });
};

exports.updateGenre = async (req, res) => {
  try {
    const numberOfUpdatedRows = await Genre.update(
      {
        type: req.body.type,
      },
      {
        returning: true,
        where: { id: req.params.id },
      },
    );

    if (numberOfUpdatedRows[1] > 0) {
      Log.create({
        event: `updated a genre (${req.params.id}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The genre is updated successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Genre is not found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const numberOfDeletedRows = await Genre.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `deleted a genre (${req.params.id}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The genre is deleted successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no genre with the that id!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};
