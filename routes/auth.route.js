const express = require('express');

const router = express.Router();
const { register, login, isAdmin } = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');

router.post('/register', register);
router.post('/login', login);
router.get('/is_admin', verifyToken, verifyAdmin, isAdmin);

module.exports = router;
