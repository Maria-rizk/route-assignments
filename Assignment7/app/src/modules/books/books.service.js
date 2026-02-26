
import booksModel from '../../DB/connection.db.js';

class BooksService {
  async createBook(book) {
    return booksModel.insertBook(book);
  }

  async createBooksBatch(books) {
    return booksModel.insertBooksBatch(books);
  }

  async createLog(log) {
    return booksModel.insertLog(log);
  }

  async updateBookYear(title, year) {
    return booksModel.updateBookYear(title, year);
  }

  async getBookByTitle(title) {
    return booksModel.findBookByTitle(title);
  }

  async getBooksByYearRange(from, to) {
    return booksModel.findBooksByYearRange(from, to);
  }

  async getBooksByGenre(genre) {
    return booksModel.findBooksByGenre(genre);
  }

  async getSkipLimitBooks() {
    return booksModel.getSkipLimitBooks();
  }

  async getBooksYearAsInteger() {
    return booksModel.findBooksYearAsInteger();
  }

  async getBooksExcludingGenres(excluded) {
    return booksModel.findBooksExcludingGenres(excluded);
  }

  async deleteBooksBeforeYear(year) {
    return booksModel.deleteBooksBeforeYear(year);
  }

  async aggregate1() { return booksModel.aggregateBooksAfter2000Sorted(); }
  async aggregate2() { return booksModel.aggregateBooksProjection(); }
  async aggregate3() { return booksModel.aggregateUnwindGenres(); }
  async aggregate4() { return booksModel.aggregateJoinBooksLogs(); }
}

module.exports = new BooksService();