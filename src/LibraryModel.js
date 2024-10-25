/**
 * @file LibraryModel.js
 * @description Contains the classes that handles objects and object logic for the library system
 * @module LibraryModel
 * @requires Catalogue
 * @requires fetch
 * @requires localStorage
 * @requires Catalogue
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */


class HomeModel {

    constructor(loggedInUser, users) {
        this.loggedInUser = loggedInUser;
        this.users = users;
        this.loadLoggedInUser();
    }
    
    logout() {
        this.loggedInUser = null;
        localStorage.removeItem('loggedInUser');
    }
    
    loadLoggedInUser() {
        const loggedInUserJSON = localStorage.getItem('loggedInUser');
        const email = loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;
        if (email) {
            this.loggedInUser = this.getUserByEmail(email);
        }
    }

    saveLoggedInUser() {
        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser.email));
    }

    async logInUser(email, password, rememberMe) {
        const user = this.getUserByEmail(email);
        if (user) {
            const encryptedEnteredPassword = await encrypt(password, user.publicKey);
            const valid = await user.checkCredentials(email, encryptedEnteredPassword)
            if (valid) {
                this.loggedInUser = user;
                if (rememberMe)
                    this.saveLoggedInUser();
                return true;
            }
        }
        return false;
    }


    getUserByEmail(email) {
        const filtered = this.users.filter(user => user.email === email);
        return filtered.length === 1 ? filtered[0] : null;

    }

}

/**
 * @class CatalogueManagementModel
 * @classdesc Handles the management of the catalogue
 * @property {Catalogue} catalogue - The catalogue object
 * @property {number} #maxBookId - The maximum book id
 * @constructor - Creates a new CatalogueManagementModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class CatalogueManagementModel {

    #maxBookId = 0;

    constructor(catalogue) {
        this.catalogue = catalogue;
        this.loadBooksFromStorage();
    }

    /**
     * Clears all books from the catalogue. Irreversible.
     */
    clearAllBooks() {
        this.catalogue = new Catalogue();
        this.saveBooksToStorage();
    }

    /**
     * Resets the books in the catalogue to the default dataset.
     * Deletes all data that was there previously.
     * @returns {Promise<void>}
     */
    async resetBooksFromDataSet() {
        const bookFetch = await fetch("./src/lib/books.json");
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
        localStorage.setItem('library_books', JSON.stringify(this.catalogue.getBooks()));
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
        this.catalogue.addBook(this.#maxBookId++, title, author, isbn, availability, location, description, genre);
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
        this.catalogue.updateBook(bookId, title, author, isbn, genre, location, description, availability)
        this.saveBooksToStorage();
    }

    /**
     * Removes a book from the catalogue. Irreversible.
     * @param id - The id of the book to remove
     */
    removeBook(id) {
        this.catalogue.deleteBook(id);
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
        return this.catalogue.searchBooks(query);
    }

    /**
     * Get a list of all the books from the catalogue
     * @returns {[]} A list of all the books in the catalogue
     */
    getBooks() {
        return this.catalogue.getBooks();
    }

}

/**
 * @class UserManagementModel
 * @classdesc Handles the management of the users
 *
 * @constructor - Creates a new UserManagementModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class UserManagementModel {

    constructor(users) {
        this.users = users;
        this.loadUsersFromStorage();
    }
    
}

/**
 * @class ReturnModel
 * @classdesc Handles the user returning books
 *
 * @constructor - Creates a new ReturnModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class ReturnModel {

}

/**
 * @class SearchModel
 * @classdesc Handles the searching of books in the catalogue
 * @property {Catalogue} catalogue - The catalogue object
 * @property {string} searchMode - The search mode that the user is using, simple or complex
 * @constructor - Creates a new SearchModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class SearchModel {

    constructor(catalogue) {
        this.catalogue = catalogue;
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
     * @returns {*} A list of the books that match the query or an empty list if none match
     */
    searchBooks(query) {
        return this.catalogue.searchBooks(query);
    }

    /**
     * Get a list of all the books from the catalogue
     * @returns {[]} A list of all the books in the catalogue
     */
    getBooks() {
        return this.catalogue.getBooks();
    }

}
