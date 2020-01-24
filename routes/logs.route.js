const express = require('express');

const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');

const { getAllLogs, createLog } = require('../controllers/logs.controller');

router.get('/', verifyToken, verifyAdmin, getAllLogs);
router.post('/', verifyToken, createLog);

module.exports = router;
