# bookworm-backend
Backend of Bookworm

## Demo
[https://bookwormapp.netlify.com/](https://bookwormapp.netlify.com/)

username: demo

password: demo

## Project setup
```
npm install
```

## Database Setup
Firstly, [update database config file here](https://github.com/serhatyuna/bookworm-backend/blob/master/config/config.json)

Then, run this command to create tables:
```
npx sequelize-cli db:migrate
```
Run these SQL queries to complete the setup: 
```sql
-- STORED PROCEDURE
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_most_liked_books` ()  BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE diff INT;

    SELECT COUNT(*) INTO total FROM (SELECT b.id, b.title, b.cover, a.firstName, a.lastName, g.type, m.cnt FROM books b INNER JOIN (SELECT bookID, createdAt, COUNT(*) cnt FROM favorites WHERE createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) and NOW() GROUP BY bookID ORDER BY cnt DESC LIMIT 5) m ON b.id = m.bookID INNER JOIN authors a ON b.authorID = a.id INNER JOIN genres g ON b.genreID = g.id) x1;
	SET diff = (5 - total);

    IF total < 5 THEN
        SELECT id, title, cover, firstName as authorFirstName, lastName as authorlastName, type as genre FROM (SELECT b.id, b.title, b.cover, a.firstName, a.lastName, g.type, m.cnt FROM books b INNER JOIN (SELECT bookID, createdAt, COUNT(*) cnt FROM favorites WHERE createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) and NOW() GROUP BY bookID ORDER BY cnt DESC LIMIT 5) m ON b.id = m.bookID INNER JOIN authors a ON b.authorID = a.id INNER JOIN genres g ON b.genreID = g.id) t1
		UNION
		SELECT id, title, cover, firstName as authorFirstName, lastName as authorlastName, type as genre FROM (SELECT b.id, b.title, b.cover, a.firstName, a.lastName, g.type, m.cnt FROM books b INNER JOIN (SELECT bookID, createdAt, COUNT(*) cnt FROM reviews WHERE createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) and NOW() GROUP BY bookID ORDER BY cnt DESC LIMIT 5) m ON b.id = m.bookID INNER JOIN authors a ON b.authorID = a.id INNER JOIN genres g ON b.genreID = g.id LIMIT diff) t2;
    ELSE
        SELECT b.id, b.title, b.cover, a.firstName as authorFirstName, a.lastName as authorLastName, g.type as genre FROM books b INNER JOIN (SELECT bookID, createdAt, COUNT(*) cnt FROM favorites WHERE createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) and NOW() GROUP BY bookID ORDER BY cnt DESC LIMIT 5) m ON b.id = m.bookID INNER JOIN authors a ON b.authorID = a.id INNER JOIN genres g ON b.genreID = g.id;
    END IF;
END$$
DELIMITER ;

-- TRIGGERS
DELIMITER $$
CREATE TRIGGER `delete_books_of_author` BEFORE DELETE ON `authors` FOR EACH ROW DELETE FROM books
	WHERE books.authorID = old.id
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `delete_reviews_and_favorites_of_book` BEFORE DELETE ON `books` FOR EACH ROW BEGIN
 	DELETE FROM reviews
    	WHERE reviews.bookID = old.id;
    DELETE FROM favorites
    	WHERE favorites.bookID = old.id;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `delete_books_of_genre` BEFORE DELETE ON `genres` FOR EACH ROW DELETE FROM books
	WHERE books.genreID = old.id
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `delete_likes_of_reviews` BEFORE DELETE ON `reviews` FOR EACH ROW DELETE FROM likes
    WHERE likes.reviewID = old.id
$$
DELIMITER ;

-- VIEWS
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `newest_books`  AS  select `b`.`id` AS `id`,`b`.`title` AS `title`,`b`.`cover` AS `cover`,`a`.`firstName` AS `authorFirstName`,`a`.`lastName` AS `authorLastName`,`g`.`type` AS `genre` from ((`books` `b` join `authors` `a` on((`b`.`authorID` = `a`.`id`))) join `genres` `g` on((`b`.`genreID` = `g`.`id`))) order by `b`.`createdAt` desc limit 5 ;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `random_books`  AS  select `b`.`id` AS `id`,`b`.`title` AS `title`,`b`.`cover` AS `cover`,`a`.`firstName` AS `authorFirstName`,`a`.`lastName` AS `authorLastName`,`g`.`type` AS `genre` from ((`books` `b` join `authors` `a` on((`b`.`authorID` = `a`.`id`))) join `genres` `g` on((`b`.`genreID` = `g`.`id`))) order by rand() limit 5 ;
```

## Compiles and hot-reloads for development
```
npm run dev
```
