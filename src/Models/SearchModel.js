/**
 * @class SearchModel
 * @classdesc Handles the searching of books in the catalogue
 * @property {Session} session - The session containing storage for the session
 * @property {string} searchMode - The search mode that the user is using, simple or complex
 * @constructor - Creates a new SearchModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class SearchModel {

    constructor(session) {
        this.session = session;
        this.searchMode = sessionStorage.getItem('searchMode') || "simple";
    }

    /**
     * Toggles the search mode between simple and complex
     */
    toggleSearchMode() {
        if (this.searchMode === "simple") this.searchMode = "complex";
        else this.searchMode = "simple";
        sessionStorage.setItem('searchMode', this.searchMode);
    }

    /**
     * Get a list of all the books from the catalogue that match the search query provided through the params object
     * @param {Object} query query to search for, all of these are optional
     * All the parameters that can be searched for are:
     * - query - Searches in title, author, or isbn
     * - id - Searches for the book id only one that returns if exact match
     * - title - Searches in title
     * - author - Searches in author
     * - isbn - Searches in isbn
     * - genre - Searches in genre
     * - location - Searches in location
     * - description - Searches in description
     * - availableOnly - Will only return books that are available even if the other parameters match
     *
     * @returns {*} - A list of the books that match the query or an empty list if none match
     */
    searchBooks(query) {
        return this.session.catalogue.searchBooks(query);
    }

    /**
     * Get a list of all the books from the catalogue
     * @returns {[]} - A list of all the books in the catalogue
     */
    getBooks() {
        return this.session.catalogue.getBooks();
    }

    /**
     * Creates a borrowing record for the user borrowing the book
     * @param book - The book to borrow
     * @param memberId - The member ID of the user borrowing
     * @returns {boolean} - Whether the book was successfully borrowed
     */
    borrowBook(book, memberId) {
        const borrowerRecord = BorrowingRecord.createRecord(this.session, book.bookId, memberId);
        return borrowerRecord !== false;

    }

}
