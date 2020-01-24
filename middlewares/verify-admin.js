const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.decoded.id,
      },
      attributes: ['userRole'],
    });
    if (user) {
      if (!user.get({ plain: true }).userRole) {
        res.status(401).json({
          status: false,
          message: 'User is not an admin!',
        });
      } else {
        next();
      }
    } else {
      res.status(401).json({
        status: false,
        message: 'User does not exist!',
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: 'A database error occurred!',
    });
  }
};
