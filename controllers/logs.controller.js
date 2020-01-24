const {
  Log, User,
} = require('../models');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      attributes: ['id', 'event', 'userID', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (logs) {
      const plainData = logs.map((like) => like.get({ plain: true }));
      const arrayOfLogs = Object.values(plainData);
      res.status(200).json({
        status: true,
        logs: arrayOfLogs,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'There is no log!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

exports.createLog = async (req, res) => {
  try {
    await Log.create({
      event: req.body.event,
      userID: req.decoded.id,
    });
    res.status(200).json({
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};
