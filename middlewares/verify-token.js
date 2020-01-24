const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token || req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: false,
          message: 'Failed to authenticate token!',
        });
      } else {
        try {
          const tokenRes = await User.findOne({
            where: { id: decoded.id },
          });
          if (!tokenRes) {
            res.status(401).json({
              status: false,
              message: 'Token is not matched with any user!',
            });
          } else {
            req.decoded = decoded;
            next();
          }
        } catch (error) {
          res.status(500).json({
            status: false,
            message: 'A database error occurred!',
          });
        }
      }
    });
  } else {
    res.status(401).json({
      status: false,
      message: 'No token provided!',
    });
  }
};
