const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Log } = require('../models');

exports.register = async (req, res) => {
  const userData = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
  };

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (!user) {
      const hash = bcrypt.hashSync(userData.password, 10);
      userData.password = hash;
      const newUser = await User.create(userData);
      const plainData = newUser.get({ plain: true });
      const token = jwt.sign(
        { id: plainData.id },
        process.env.SECRET_KEY,
        { expiresIn: '8 hours' },
      );
      Log.create({
        event: 'registered to the system.',
        userID: plainData.id,
      });
      res.status(200).json({
        status: true,
        token,
        user: {
          id: plainData.id,
          username: plainData.username,
          email: plainData.email,
          firstName: plainData.firstName,
          lastName: plainData.lastName,
        },
      });
    } else {
      res.status(422).json({
        status: false,
        message: 'User already exists or email is already in use!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: (typeof error !== 'object') ? error || 'A database error occurred.' : 'A database error occurred.',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      const plainData = user.get({ plain: true });
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_KEY, { expiresIn: '8 hours' });
        Log.create({
          event: 'logged in to the system.',
          userID: plainData.id,
        });
        res.status(200).json({
          status: true,
          token,
          user: {
            id: plainData.id,
            username: plainData.username,
            email: plainData.email,
            firstName: plainData.firstName,
            lastName: plainData.lastName,
          },
        });
      } else {
        res.status(400).json({
          status: false,
          message: 'Username or password is wrong!',
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: 'Username or password is wrong!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: (typeof error !== 'object') ? error || 'A database error occurred.' : 'A database error occurred.',
    });
  }
};

exports.isAdmin = (req, res) => {
  res.status(200).json({
    status: true,
  });
};
