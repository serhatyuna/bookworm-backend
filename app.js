const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter = require('./routes/auth.route');
const usersRouter = require('./routes/users.route');
const authorsRouter = require('./routes/authors.route');
const genresRouter = require('./routes/genres.route');
const favoritesRouter = require('./routes/favorites.route');
const booksRouter = require('./routes/books.route');
const reviewsRouter = require('./routes/reviews.route');
const likesRouter = require('./routes/likes.route');
const logsRouter = require('./routes/logs.route');

const app = express();

process.env.SECRET_KEY = 'u-s9qww3UQjVL3UL_jD^xJjcWjtZUyS*$Z8qtEJaV6zh-QY2wx5MjSBEh$%t7bYKQu-*zG7f^+agBr#jQvQCKk=CgB_RQT7Un%vh^v%2mMnqG=+*Z@LgU=zD@PGCvUqfMMXpAJBys!s&?t@NT3PXpuZ2&z_R=&eShy+NzuPm_P5bt$PLb^pF!5bMs368Jaq97HNtG@$bPn9VhK@z&kGEPj^8Dh72&v3Bh@+nmF-Ds+FF_kUhEz2SU3jxJg?%q9dWScNM*Vp64S8$UEg8zEtwJj7uJqQ2nRN__nKCq*vG*ctT4Uy2wy*@=28QVc5euFaVq4pqXK9kbtXEcBeV-rXqPW7R5Myk+TNd!bgbs6shwsXnYBce^^&5tRf=WBUAAtxV-@pYvTmTTpQ4keDZU_R-r_U5_5_LVMdXG8#Jw+Wn9huJ%mHP-S4dH7jSAcEtx@&xmp9r$yApZ9#9xR7AnAgcn!hgmKB%PxqzvGz!+sv3^Pm?VvmuWr48T#P28sMaNf+N';

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/books', booksRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/logs', logsRouter);

app.use('/', (req, res) => {
  res.sendStatus(404);
});

module.exports = app;
