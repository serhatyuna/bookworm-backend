const express = require('express');

const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const verifyAdmin = require('../middlewares/verify-admin');
const { bookPostValidation, bookParamValidation, bookQueryValidation } = require('../middlewares/validations/book.validation');

const {
  getAllBooks,
  getRandomBooks,
  getNewestBooks,
  getMostLikedBooks,
  getBookById,
  searchBookByTitle,
  createBook,
  deleteBook,
  updateBook,
} = require('../controllers/books.controller');

router.get('/', verifyToken, getAllBooks);
router.get('/random', verifyToken, getRandomBooks);
router.get('/newest', verifyToken, getNewestBooks);
router.get('/mostliked', verifyToken, getMostLikedBooks);
router.post('/', verifyToken, bookPostValidation, createBook);
router.get('/:id', verifyToken, bookParamValidation, getBookById);
router.get('/search/:title', verifyToken, bookQueryValidation, searchBookByTitle);
router.delete('/:id', verifyToken, verifyAdmin, bookParamValidation, deleteBook);
router.put('/:id', verifyToken, verifyAdmin, bookParamValidation, bookPostValidation, updateBook);

module.exports = router;
