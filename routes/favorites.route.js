const express = require('express');

const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');

const {
  getAllFavorites,
  getFavoritesOfUserByID,
  isBookFavorited,
  createFavorite,
  deleteFavorite,
  adminDeleteFavorite,
} = require('../controllers/favorites.controller');

router.get('/', verifyToken, getAllFavorites);
router.get('/user/:id', verifyToken, getFavoritesOfUserByID);
router.get('/book/:bookID', verifyToken, isBookFavorited);
router.post('/create', verifyToken, createFavorite);
router.delete('/:bookID', verifyToken, deleteFavorite);
router.delete('/admin/:id', verifyToken, verifyAdmin, adminDeleteFavorite);

module.exports = router;
