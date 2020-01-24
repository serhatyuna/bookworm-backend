const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

const {
  sequelize, Book, Author, Genre, Log,
} = require('../models');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [{
        model: Author,
        attributes: ['firstName', 'lastName'],
      }, {
        model: Genre,
        attributes: ['type'],
      }],
    });

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
        message: 'No book in the database!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getRandomBooks = async (req, res) => {
  try {
    const books = await sequelize.query('SELECT * FROM random_books', {
      type: sequelize.QueryTypes.SELECT,
    });

    if (books) {
      res.status(200).json({
        status: true,
        books,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'No book in the database!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getNewestBooks = async (req, res) => {
  try {
    const books = await sequelize.query('SELECT * FROM newest_books', {
      type: sequelize.QueryTypes.SELECT,
    });

    if (books) {
      res.status(200).json({
        status: true,
        books,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'No book in the database!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getMostLikedBooks = async (req, res) => {
  try {
    const books = await sequelize.query('CALL get_most_liked_books()', null, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (books) {
      res.status(200).json({
        status: true,
        books,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'No book in the database!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.getBookById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array(),
    });
  }

  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Author,
      }, {
        model: Genre,
      }],
    });

    if (book) {
      const plainData = book.get({ plain: true });
      res.status(200).json({
        status: true,
        book: plainData,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Book does not exist!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.searchBookByTitle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array(),
    });
  }

  try {
    // We will look for all words in the search query
    // in case the user cannot remember the full title of the book etc.
    const queryTokens = req.params.title.split(' ');
    const books = await Book.findAll({
      where: {
        [Op.or]: queryTokens.map((token) => sequelize.where(sequelize.fn('lower', sequelize.col('title')), 'LIKE', `%${token}%`)),
      },
      attributes: ['id', 'title', 'cover'],
      include: [{
        model: Author,
        attributes: ['firstName', 'lastName'],
      }],
    });

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
        message: 'Book does not exist!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || 'A database error occurred.',
    });
  }
};

exports.createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array(),
    });
  }

  const book = {
    isbn: req.body.isbn,
    title: req.body.title,
    description: req.body.description,
    cover: req.body.cover,
    releasedYear: req.body.releasedYear,
    language: req.body.language,
    pageNumber: req.body.pageNumber,
    authorID: req.body.authorID,
    genreID: req.body.genreID,
  };

  try {
    const newBook = await Book.create(book);
    const plainData = newBook.get({ plain: true });

    Log.create({
      event: `created a book (${plainData.id}).`,
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

exports.deleteBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array(),
    });
  }

  try {
    const numberOfDeletedRows = await Book.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `deleted a book (${req.params.id}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The book is deleted successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Book is not found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array(),
    });
  }

  try {
    const numberOfUpdatedRows = await Book.update(
      {
        isbn: req.body.isbn,
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover,
        releasedYear: req.body.releasedYear,
        language: req.body.language,
        pageNumber: req.body.pageNumber,
        authorID: req.body.authorID,
        genreID: req.body.genreID,
      },
      {
        returning: true,
        where: { id: req.params.id },
      },
    );

    if (numberOfUpdatedRows[1] > 0) {
      Log.create({
        event: `updated a book (${req.params.id}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The book is updated successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Book is not found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};
