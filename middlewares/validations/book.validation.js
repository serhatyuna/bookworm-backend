const { body, param } = require('express-validator');

exports.bookPostValidation = [
  body('isbn')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('ISBN is required')
    .isString()
    .isLength({ max: 15 })
    .withMessage('ISBN must have less than 15 characters'),
  body('title')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Title is required')
    .isString()
    .isLength({ max: 255 })
    .withMessage('Title must have less than 255 characters'),
  body('description')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Description is required'),
  body('cover')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Cover is required')
    .isURL()
    .withMessage('Cover should be a valid URL'),
  body('releasedYear')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Released year is required')
    .isInt({ gt: 0, lt: 2101 })
    .withMessage('Released year should be between 1 and 2100'),
  body('language')
    .trim()
    .isString()
    .not()
    .isEmpty()
    .withMessage('Language is required'),
  body('pageNumber')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Page number is required')
    .isInt({ gt: 0, lt: 30000 })
    .withMessage('Page number should be greater than 0'),
  body('authorID')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Author is required')
    .isInt({ gt: 0 })
    .withMessage('Author should have a valid id'),
  body('genreID')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Genre is required')
    .isInt({ gt: 0 })
    .withMessage('Genre should have a valid id'),
];

exports.bookParamValidation = [
  param('id')
    .trim()
    .not()
    .isEmpty()
    .withMessage('ID param is required')
    .isInt({ gt: 0 })
    .withMessage('ID should be an integer greater than 0'),
];

exports.bookQueryValidation = [
  param('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Search query is required'),
];
