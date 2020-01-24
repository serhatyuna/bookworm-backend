const {
  sequelize, Review, Like, Book, User, Log,
} = require('../models');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      attributes: ['id', 'content', 'userID', 'bookID', 'createdAt'],
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
    if (reviews) {
      const plainData = reviews.map((review) => review.get({ plain: true }));
      const arrayOfReviews = Object.values(plainData);
      res.status(200).json({
        status: true,
        reviews: arrayOfReviews,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no review!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.getReviewsOfUserByID = async (req, res) => {
  try {
    const reviews = await sequelize.query('SELECT r.id, r.content, r.createdAt, u.id as userID, u.username, u.firstName, u.lastName, b.id as bookID, b.title, IFNULL(l.count_of_likes, 0) as countOfLikes FROM reviews r INNER JOIN users u ON r.userID = u.id INNER JOIN books as b ON r.bookID = b.id LEFT JOIN (SELECT reviewID, COUNT(*) as count_of_likes FROM likes WHERE reviewID IN (SELECT id FROM reviews) GROUP BY reviewID) as l ON r.id = l.reviewID WHERE userID = :userID ORDER BY createdAt DESC', {
      replacements: {
        userID: req.params.userID,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    if (typeof reviews !== 'undefined' && reviews && reviews.length > 0) {
      res.status(200).json({
        status: true,
        reviews,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'This user has no review!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.createReview = (req, res) => {
  Review.findOne({
    where: {
      userID: req.decoded.id,
      bookID: req.body.bookID,
    },
  })
    .then((review) => {
      if (review) {
        res.status(409).json({
          status: false,
          message: 'You already made a review for this book!',
        });
      } else {
        const payload = {
          userID: req.decoded.id,
          bookID: req.body.bookID,
          content: req.body.content,
        };
        Review.create(payload)
          .then((newReview) => {
            const plainData = newReview.get({ plain: true });
            Log.create({
              event: `published a review (${newReview.id}).`,
              userID: req.decoded.id,
            });
            res.status(200).json({
              status: true,
              review: plainData,
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: false,
              message: err,
            });
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

exports.getReviewsOfBook = async (req, res) => {
  try {
    const reviews = await sequelize.query('SELECT r.id, r.content, r.createdAt, u.id as userID, u.username, u.firstName, u.lastName, IFNULL(l.count_of_likes, 0) as countOfLikes FROM reviews r INNER JOIN users u ON r.userID = u.id LEFT JOIN (SELECT reviewID, COUNT(*) as count_of_likes FROM likes WHERE reviewID IN (SELECT id FROM reviews) GROUP BY reviewID) as l ON r.id = l.reviewID WHERE bookID = :bookID ORDER BY createdAt DESC', {
      replacements: {
        bookID: req.params.bookID,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    if (typeof reviews !== 'undefined' && reviews && reviews.length > 0) {
      Promise.all(reviews.map(async (review) => {
        const isLiked = await sequelize.query('SELECT 1 as isLiked FROM likes WHERE userID = :userID AND reviewID = :reviewID LIMIT 1', {
          replacements: {
            userID: req.decoded.id,
            reviewID: review.id,
          },
          type: sequelize.QueryTypes.SELECT,
        });
        if (typeof isLiked[0] === 'undefined' || !isLiked || isLiked.length === 0) {
          review.isLiked = 0;
        } else {
          review.isLiked = 1;
        }
        return review;
      }))
        .then(() => {
          res.status(200).json({
            status: true,
            reviews,
          });
        })
        .catch(() => {
          res.status(200).json({
            status: true,
            reviews,
          });
        });
    } else {
      res.status(404).json({
        status: false,
        message: 'This book has no review!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const numberOfDeletedRows = await Review.destroy({
      where: {
        id: req.params.reviewID,
        userID: req.decoded.id,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `deleted a review (${req.params.reviewID}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The review is deleted successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no review with the that id!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.adminDeleteReview = async (req, res) => {
  try {
    const numberOfDeletedRows = await Review.destroy({
      where: {
        id: req.params.reviewID,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `deleted a review (${req.params.reviewID}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The review is deleted successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no review with the that id!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};
