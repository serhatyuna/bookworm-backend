const {
  Favorite, Book, Author, User, Log,
} = require('../models');

exports.getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      attributes: ['id', 'userID', 'bookID', 'createdAt'],
      include: [
        {
          model: Book,
          attributes: ['title'],
        },
        {
          model: User,
          attributes: ['username'],
        }],
    });
    if (favorites) {
      const plainData = favorites.map((favorite) => favorite.get({ plain: true }));
      const arrayOfFavorites = Object.values(plainData);
      res.status(200).json({
        status: true,
        favorites: arrayOfFavorites,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no favorite!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.getFavoritesOfUserByID = (req, res) => {
  Favorite.findAll({
    attributes: ['id'],
    where: {
      userID: req.params.id,
    },
    include: [{
      model: Book,
      attributes: ['id', 'title', 'cover'],
      include: [{
        model: Author,
        attributes: ['firstName', 'lastName'],
      }],
    }],
  })
    .then((favorites) => {
      if (favorites) {
        const plainData = favorites.map((favorite) => favorite.get({ plain: true }));
        const arrayOfFavorites = Object.values(plainData);

        res.status(200).json({
          status: true,
          favorites: arrayOfFavorites,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'No favorite books!',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: (typeof error !== 'object') ? error || 'A database error occurred.' : 'A database error occurred.',
      });
    });
};

exports.createFavorite = (req, res) => {
  Favorite.findOne({
    where: {
      userID: req.decoded.id,
      bookID: req.body.bookID,
    },
  })
    .then((favorite) => {
      if (favorite) {
        res.status(409).json({
          status: false,
          message: 'You already added this book to your favorite books!',
        });
      } else {
        const payload = {
          userID: req.decoded.id,
          bookID: req.body.bookID,
        };
        Favorite.create(payload)
          .then((newFavorite) => {
            const plainData = newFavorite.get({ plain: true });
            Log.create({
              event: `favorited a book (${req.body.bookID}).`,
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
              message: (typeof error !== 'object') ? error || 'A database error occurred.' : 'A database error occurred.',
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: (typeof error !== 'object') ? error || 'A database error occurred.' : 'A database error occurred.',
      });
    });
};

exports.isBookFavorited = async (req, res) => {
  Favorite.findOne({
    where: {
      userID: req.decoded.id,
      bookID: req.params.bookID,
    },
  })
    .then((fav) => {
      if (fav) {
        res.status(200).json({
          status: true,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'This book is not favorited',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: err,
      });
    });
};

exports.deleteFavorite = async (req, res) => {
  try {
    const numberOfDeletedRows = await Favorite.destroy({
      where: {
        bookID: req.params.bookID,
        userID: req.decoded.id,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `removed a book (${req.params.bookID}) from favorite list.`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The favorite is deleted successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no favorite with the that id!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.adminDeleteFavorite = async (req, res) => {
  try {
    const numberOfDeletedRows = await Favorite.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `removed a book (${req.params.bookID}) from favorite list.`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The favorite is deleted successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no favorite with the that id!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};
