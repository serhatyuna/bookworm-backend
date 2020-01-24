const express = require('express');
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');

const router = express.Router();

const {
  getAllUsers,
  getProfile,
  getProfileByUsername,
} = require('../controllers/users.controller');

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.get('/profile', verifyToken, getProfile);
router.get('/profile/:username', verifyToken, getProfileByUsername);

module.exports = router;
