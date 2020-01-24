const express = require('express');

const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');
const {
  getAllGenres,
  getMostPopularGenre,
  getGenreById,
  createGenre,
  getBooksOfGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genres.controller');

router.get('/', verifyToken, getAllGenres);
router.get('/mostpopular', verifyToken, getMostPopularGenre);
router.post('/', verifyToken, createGenre);
router.get('/:id', verifyToken, getGenreById);
router.get('/:id/books', verifyToken, getBooksOfGenre);
router.put('/:id', verifyToken, verifyAdmin, updateGenre);
router.delete('/:id', verifyToken, verifyAdmin, deleteGenre);

module.exports = router;
