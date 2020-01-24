const express = require('express');

const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');

const {
  getAllReviews,
  getReviewsOfUserByID,
  getReviewsOfBook,
  createReview,
  deleteReview,
  adminDeleteReview,
} = require('../controllers/reviews.controller');

router.get('/', verifyToken, verifyAdmin, getAllReviews);
router.get('/user/:userID', verifyToken, getReviewsOfUserByID);
router.get('/book/:bookID', verifyToken, getReviewsOfBook);
router.post('/create', verifyToken, createReview);
router.delete('/:reviewID', verifyToken, deleteReview);
router.delete('/admin/:reviewID', verifyToken, verifyAdmin, adminDeleteReview);

module.exports = router;
