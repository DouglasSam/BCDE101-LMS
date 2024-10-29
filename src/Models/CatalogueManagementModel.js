/**
 * @class CatalogueManagementModel
 * @classdesc Handles the management of the catalogue
 * @property {Session} session - The session object containing the storage for the session
 * @property {number} #maxBookId - The maximum book id
 * @constructor - Creates a new CatalogueManagementModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class CatalogueManagementModel {

    #maxBookId = 0;

    constructor(session) {
        this.session = session;
        this.loadBooksFromStorage();
    }

    /**
     * Clears all books from the catalogue. Irreversible.
     */
    clearAllBooks() {
        this.session.catalogue = new Catalogue();
        this.saveBooksToStorage();
    }

    /**
     * Resets the books in the catalogue to the default dataset.
     * Deletes all data that was there previously.
     * @returns {Promise<void>}
     */
    async resetBooksFromDataSet() {
        const bookFetch = await fetch("./src/Data/books.json");
        let books = [];
        if (bookFetch.ok) {
            books = await bookFetch.json();
        }
        books.forEach(book => this.addBook(book.title, book.author, book.isbn, book.genre, book.location, book.description, book.available));
    }

    /**
     * Loads the books from local storage into the catalogue
     */
    loadBooksFromStorage() {
        let booksJSON = localStorage.getItem('library_books');
        let books = booksJSON ? JSON.parse(booksJSON) : [];
        books.forEach(book => this.addBook(book.title, book.author, book.isbn, book.genre, book.location, book.description, book.availability));
    }

    /**
     * Saves the books in the catalogue to local storage
     */
    saveBooksToStorage() {
        localStorage.setItem('library_books', JSON.stringify(this.session.catalogue.getBooks()));
    }

    /**
     * Adds a book to the catalogue
     * @param title - The title of the book
     * @param author - The author of the book
     * @param isbn - The ISBN of the book
     * @param genre - The genre of the book
     * @param location - The location of the book
     * @param description - The description of the book
     * @param availability - Whether the book is available
     */
    addBook(title, author, isbn, genre, location, description, availability = true) {
        this.session.catalogue.addBook(this.#maxBookId++, title, author, isbn, availability, location, description, genre);
        this.saveBooksToStorage();
    }

    /**
     * Updates a book in the catalogue with the given details
     * It required all the book details but to not change them just pass in the current value
     * @param bookId - The unique identifier for the book CANNOT be changed
     * @param title - The title of the book
     * @param author - The author of the book
     * @param isbn - The ISBN of the book
     * @param genre - The genre of the book
     * @param location - The location of the book
     * @param description - The description of the book
     * @param availability - Whether the book is available
     */
    updateBook(bookId, title, author, isbn, genre, location, description, availability) {
        this.session.catalogue.updateBook(bookId, title, author, isbn, genre, location, description, availability)
        this.saveBooksToStorage();
    }

    /**
     * Removes a book from the catalogue. Irreversible.
     * @param id - The id of the book to remove
     */
    removeBook(id) {
        this.session.catalogue.deleteBook(id);
        this.saveBooksToStorage();
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
     * @returns {*} A list of the books that match the query or an empty list if none match
     */
    searchBooks(query) {
        return this.session.catalogue.searchBooks(query);
    }

    /**
     * Get a list of all the books from the catalogue
     * @returns {[]} A list of all the books in the catalogue
     */
    getBooks() {
        return this.session.catalogue.getBooks();
    }

}
