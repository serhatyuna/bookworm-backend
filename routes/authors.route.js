const express = require('express');

const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');
const {
  getAllAuthors,
  getMostPopularAuthor,
  getAuthorById,
  createAuthor,
  getBooksOfAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authors.controller');

router.get('/', verifyToken, getAllAuthors);
router.get('/mostpopular', verifyToken, getMostPopularAuthor);
router.post('/', verifyToken, createAuthor);
router.get('/:id', verifyToken, getAuthorById);
router.get('/:id/books', verifyToken, getBooksOfAuthor);
router.put('/:id', verifyToken, verifyAdmin, updateAuthor);
router.delete('/:id', verifyToken, verifyAdmin, deleteAuthor);

module.exports = router;
