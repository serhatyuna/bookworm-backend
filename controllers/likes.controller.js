const sequelize = require('sequelize');
const {
  Review, Like, Book, User, Log,
} = require('../models');

exports.getAllLikes = async (req, res) => {
  try {
    const likes = await Like.findAll({
      attributes: ['id', 'userID', 'reviewID', 'createdAt'],
      include: [
        {
          model: Review,
          attributes: ['id', 'content'],
          include: [
            {
              model: User,
              attributes: ['id', 'username'],
            },
            {
              model: Book,
              attributes: ['id', 'title'],
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        }],
    });
    if (likes) {
      const plainData = likes.map((like) => like.get({ plain: true }));
      const arrayOfLikes = Object.values(plainData);
      res.status(200).json({
        status: true,
        likes: arrayOfLikes,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no like!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.createLike = (req, res) => {
  Like.findOne({
    where: {
      userID: req.decoded.id,
      reviewID: req.body.reviewID,
    },
  })
    .then((like) => {
      if (like) {
        res.status(409).json({
          status: false,
          message: 'You already liked this review!',
        });
      } else {
        const payload = {
          userID: req.decoded.id,
          reviewID: req.body.reviewID,
        };
        Like.create(payload)
          .then(() => {
            Log.create({
              event: `liked a review (${req.body.reviewID}).`,
              userID: req.decoded.id,
            });
            res.status(200).json({
              status: true,
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

exports.getLikesOfReview = async (req, res) => {
  Like.findAll({
    where: {
      attributes: [[sequelize.fn('count', sequelize.col('reviews.reviewID')), 'count_of_likes']],
      reviewID: req.params.reviewID,
    },
    include: [{
      model: Review,
      attributes: [],
    }],
    group: ['reviews.id'],
  })
    .then((count) => {
      const plainData = count.get({ plain: true });
      res.status(200).json({
        status: true,
        countOfLikes: plainData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: err,
      });
    });
};

exports.deleteLike = async (req, res) => {
  try {
    const numberOfDeletedRows = await Like.destroy({
      where: {
        userID: req.decoded.id,
        reviewID: req.params.reviewID,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `deleted a like of review (${req.params.reviewID}).`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The like is revoked successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no such like data in the database!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.adminDeleteLike = async (req, res) => {
  try {
    const numberOfDeletedRows = await Like.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (numberOfDeletedRows > 0) {
      Log.create({
        event: `deleted a like (${req.params.id}) of review.`,
        userID: req.decoded.id,
      });
      res.status(200).json({
        status: true,
        message: 'The like is revoked successfully!',
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no such like data in the database!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};
