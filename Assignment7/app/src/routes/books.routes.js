const express = require('express');
const router = express.Router();
const ctrl = require('../modules/books/books.controller.js');

// 1. POST /collection/books → creates collection (handled in connection.db.js)
router.post('/collection/books', (req, res) => {
  res.json({ ok: 1, message: 'Collection "books" created with validation (init done on boot)' });
});

// 2. POST /collection/authors
router.post('/collection/authors', (req, res) => {
  res.json({ ok: 1, message: 'Implicit collection "authors" created via insert (done on boot)' });
});

// 3. POST /collection/logs/capped
router.post('/collection/logs/capped', (req, res) => {
  res.json({ ok: 1, message: 'Capped collection "logs" created (done on boot)' });
});

// 4. POST /collection/books/index
router.post('/collection/books/index', (req, res) => {
  res.json({ ok: 1, message: 'Index on title created (done on boot)' });
});

// 5. POST /books
router.post('/books', ctrl.createBook);

// 6. POST /books/batch
router.post('/books/batch', ctrl.createBooksBatch);

// 7. POST /logs
router.post('/logs', ctrl.createLog);

// 8. PATCH /books/:title
router.patch('/books/:title', ctrl.updateBookYear);

// 9. GET /books/title?title=...
router.get('/books/title', ctrl.getBookByTitle);

// 10. GET /books/year?from=&to=
router.get('/books/year', (req, res) => {
  const from = parseInt(req.query.from);
  const to = parseInt(req.query.to);
  service.getBooksByYearRange(from, to)
    .then(books => res.json({ books }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 11. GET /books/genre?genre=...
router.get('/books/genre', (req, res) => {
  service.getBooksByGenre(req.query.genre)
    .then(books => res.json({ books }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 12. GET /books/skip-limit
router.get('/books/skip-limit', (req, res) => {
  service.getSkipLimitBooks()
    .then(books => res.json({ books }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 13. GET /books/year-integer
router.get('/books/year-integer', (req, res) => {
  service.getBooksYearAsInteger()
    .then(books => res.json({ books }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 14. GET /books/exclude-genres
router.get('/books/exclude-genres', (req, res) => {
  const excluded = ['Horror', 'Science Fiction'];
  service.getBooksExcludingGenres(excluded)
    .then(books => res.json({ books }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 15. DELETE /books/before-year?year=2000
router.delete('/books/before-year', (req, res) => {
  const year = parseInt(req.query.year);
  service.deleteBooksBeforeYear(year)
    .then(result => res.json({ ok: 1, deleted: result.deletedCount }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 16. GET /books/aggregate1
router.get('/books/aggregate1', (req, res) => {
  service.aggregate1()
    .then(result => res.json({ result }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 17. GET /books/aggregate2
router.get('/books/aggregate2', (req, res) => {
  service.aggregate2()
    .then(result => res.json({ result }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 18. GET /books/aggregate3
router.get('/books/aggregate3', (req, res) => {
  service.aggregate3()
    .then(result => res.json({ result }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// 19. GET /books/aggregate4
router.get('/books/aggregate4', (req, res) => {
  service.aggregate4()
    .then(result => res.json({ result }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;