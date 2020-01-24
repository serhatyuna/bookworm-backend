const express = require('express');

const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');

const {
  getAllLikes,
  getLikesOfReview,
  createLike,
  deleteLike,
  adminDeleteLike,
} = require('../controllers/likes.controller');

router.get('/', verifyToken, verifyAdmin, getAllLikes);
router.get('/review/:reviewID', verifyToken, getLikesOfReview);
router.post('/create', verifyToken, createLike);
router.delete('/:reviewID', verifyToken, deleteLike);
router.delete('/admin/:id', verifyToken, verifyAdmin, adminDeleteLike);

module.exports = router;
