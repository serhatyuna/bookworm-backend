const Sequelize = require('sequelize');
const {
  sequelize, Author, Book, Genre, Log,
} = require('../models');

exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await sequelize.query('SELECT a.id as id, a.firstName as firstName, a.lastName as lastName, a.biography as biography, a.createdAt as createdAt, IFNULL(b.number_of_books, 0) as number_of_books FROM authors a LEFT JOIN (SELECT authorID, COUNT(*) number_of_books FROM books GROUP BY authorID) b ON a.id = b.authorID ORDER BY firstName ASC, lastName ASC', {
      type: sequelize.QueryTypes.SELECT,
    });

    if (authors) {
      res.status(200).json({
        status: true,
        authors,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'No author in the database!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getMostPopularAuthor = async (req, res) => {
  try {
    const author = await sequelize.query(`SELECT authorID as id, authors.firstName, authors.lastName FROM
    ((SELECT b.id, b.title, a.id authorID, a.firstName, a.lastName, f.countOfFavorites c, SUM(f.countOfFavorites) s FROM authors a INNER JOIN books b ON a.id = b.authorID INNER JOIN (SELECT bookID, COUNT(*) countOfFavorites FROM favorites GROUP BY bookID) f ON b.id = f.bookID GROUP BY authorID ORDER BY s DESC) UNION (SELECT b.id, b.title, a.id authorID, a.firstName, a.lastName, r.countOfReviews c, SUM(r.countOfReviews) s FROM authors a INNER JOIN books b ON a.id = b.authorID INNER JOIN (SELECT bookID, COUNT(*) countOfReviews FROM reviews GROUP BY bookID) r ON b.id = r.bookID GROUP BY authorID ORDER BY s DESC)) x INNER JOIN authors ON x.authorID = authors.id GROUP BY authorID ORDER BY SUM(s) DESC LIMIT 1`, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (author) {
      res.status(200).json({
        status: true,
        author: author[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'No author is popular.',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      attributes: ['id', 'firstName', 'lastName', 'biography'],
    });

    if (author) {
      const plainData = author.get({ plain: true });
      res.status(200).json({
        status: true,
        author: plainData,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Author does not exist!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getBooksOfAuthor = (req, res) => {
  Book.findAll({
    where: {
      authorID: req.params.id,
    },
    attributes: ['id', 'title', 'cover'],
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

exports.createAuthor = async (req, res) => {
  const author = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    biography: req.body.biography,
  };

  try {
    const newAuthor = await Author.create(author);
    const plainData = newAuthor.get({ plain: true });

    Log.create({
      event: `created an author (${plainData.id}).`,
      userID: req.decoded.id,
    });
    res.status(200).json({
      status: true,
      ...plainData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const numberOfUpdatedRows = await Author.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        biography: req.body.biography,
      },
      {
        returning: true,
        where: { id: req.params.id },
      },
    );

    if (numberOfUpdatedRows[1] > 0) {
      Log.create({
        event: `updated an author (${req.params.id}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The author is updated successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Author is not found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const numberOfDeletedRows = await Author.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `deleted an author (${req.params.id}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The author is deleted successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Author is not found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};
