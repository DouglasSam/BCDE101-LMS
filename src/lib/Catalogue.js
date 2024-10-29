/**
 * @class Catalogue
 * @classdesc Represents a catalogue of books in the library system
 * @property {Book[]} #books - The books in the catalogue
 * @constructor - Creates a new catalogue
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class Catalogue {
    #books;

    constructor() {
        this.#books = [];
    }

    /**
     * Adds a book to the catalogue with the given details
     * Only id, title, author and isbn is required all others are optional
     * @param {number} id - The unique identifier for the book
     * @param {string} title - The title of the book
     * @param {string} author - The author of the book
     * @param {string} isbn - The ISBN of the book
     * @param {boolean} availability - Whether the book is available
     * @param {string} location - The location of the book
     * @param {string} description - The description of the book
     * @param {string} genre - The genre of the book
     */
    addBook(id, title, author, isbn, availability = true, location = "Library", description = "", genre = "undefined", ) {
        this.#books.push(new Book(id, title, author, isbn, availability, location, description, genre));
    }

    /**
     * Updates a book in the catalogue with the given details
     * It required all the book details but to not change them just pass in the current value
     * @param bookId - The unique identifier for the book Is used to identify the book to update not update
     * @param isbn - The ISBN of the book
     * @param title - The title of the book
     * @param author - The author of the book
     * @param genre - The genre of the book
     * @param location - The location of the book
     * @param description - The description of the book
     * @param availability - Whether the book is available
     */
    updateBook(bookId, isbn, title, author, genre, location, description, availability) {
        const index = this.#books.findIndex(book => book.viewBookDetails().bookId.toString() === bookId.toString());
        if (index !== -1) {
            this.#books[index] = new Book(bookId, title, author, isbn, availability, location, description, genre);
        }
    }

    /**
     * Deletes a book from the catalogue with the given bookID
     * This is permanent and cannot be undone
     * @param bookID - The unique identifier for the book to be deleted
     */
    deleteBook(bookID) {
        this.#books = this.#books.filter(book => book.viewBookDetails().bookId.toString() !== bookID.toString());
    }

    /**
     * Get a list of all the books that match the search query provided through the params object
     * @param {Object} params parameters to search for, all of these are optional
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
    searchBooks(params) {
        return this.#books.filter(book => book.searchBooks(params)).map(book => book.viewBookDetails());
    }

    /**
     * Gets all the books in the catalogue
     * @returns {[]} A list of all the books in the catalogue
     */
    getBooks() {
        return this.#books.map(book => book.viewBookDetails());
    }

    get books() {
        return this.#books;
    }
}
