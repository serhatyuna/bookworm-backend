const { User } = require('../models');

exports.getAllUsers = (req, res) => {
  User.findAll({
    attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'userRole', 'createdAt'],
    order: [['userRole', 'DESC'], ['id', 'ASC']],
  }).then((users) => {
    if (users) {
      const plainData = users.map((user) => user.get({ plain: true }));
      const arrayOfUsers = Object.values(plainData);
      res.status(200).json({
        status: true,
        users: arrayOfUsers,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no user in the database',
      });
    }
  }).catch(() => {
    res.status(500).json({
      status: false,
      message: 'A database error occurred',
    });
  });
};

exports.getProfile = (req, res) => {
  User.findOne({
    where: {
      id: req.decoded.id,
    },
    attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'createdAt'],
  })
    .then((user) => {
      if (user) {
        const plainData = user.get({ plain: true });
        res.status(200).json({
          status: true,
          user: plainData,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'User does not exist!',
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

exports.getProfileByUsername = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'createdAt'],
      where: {
        username: req.params.username,
      },
    });

    if (user) {
      const plainData = user.get({ plain: true });
      res.status(200).json({
        status: true,
        user: plainData,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'User does not exist!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: (typeof error !== 'object') ? error || 'A database error occurred.' : 'A database error occurred.',
    });
  }
};
