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

    constructor(session) {
        this.session = session;
        this.loadLoggedInUser();
    }
    
    logout() {
        this.session.loggedInUser = null;
        localStorage.removeItem('loggedInUser');
    }
    
    loadLoggedInUser() {
        const loggedInUserJSON = localStorage.getItem('loggedInUser');
        const email = loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;
        if (email) {
            this.session.loggedInUser = this.getUserByEmail(email);
        }
    }

    saveLoggedInUser() {
        localStorage.setItem('loggedInUser', JSON.stringify(this.session.loggedInUser.email));
    }

    logInUser(email, password, rememberMe) {
        const user = this.getUserByEmail(email);
        if (user) {
            // Only allow Librarians to log in
            if (user.role === "Librarian") {
                const valid = user.checkCredentials(email, password)
                if (valid) {
                    this.session.loggedInUser = user;
                    if (rememberMe)
                        this.saveLoggedInUser();
                    return true;
                }
            }
        }

        return false;
    }


    getUserByEmail(email) {
        const filtered = this.session.users.filter(user => user.email === email);
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

    #START_USER_ID = 100000;
    maxUserId = this.#START_USER_ID;


    constructor(session) {
        this.session = session;
        this.loadUsersFromStorage();
        
    }

    updateUser(userId, name, email, password, role, membershipId=undefined) {
        const user = this.getUserByID(userId);
        if (user === null) return false;
        if (email !== user.email && this.getUserByEmail(email) !== null) return false
        if (membershipId !== undefined && this.session.users.filter(user => {
            if (user.membershipId === undefined) return false;
            return user.membershipId.toString() === membershipId
        }).length > 0) return false;
        user.updateUser(name, email, password, role, membershipId);
        if (this.session.loggedInUser.userId === userId) this.session.loggedInUser = user;
        this.saveUsersToStorage();
        return user;
    }

    getUserByEmail(email) {
        const filtered = this.session.users.filter(user => user.email === email);
        return filtered.length === 1 ? filtered[0] : null;
    }
    
    getUserByID(userId) {
        const filtered = this.session.users.filter(user => user.userId.toString() === userId.toString());
        return filtered.length === 1 ? filtered[0] : null;
    }
    
    searchUsers(query) {
        return this.session.users.filter(user => user.name.includes(query) || user.email.includes(query) || user.userId.toString().includes(query));
    }

    loadUsersFromStorage() {
        const loggedIn = this.session.loggedInUser;
        this.session.loggedInUser = new Librarian(0, 'system', 'system@system', 'system');
        let usersJSON = localStorage.getItem('library_users');
        let users = usersJSON ? JSON.parse(usersJSON) : [];
        this.#loadFromArray(users);
        // let admin = this.getUserByID(1);
        // console.log(admin);
        this.session.loggedInUser = loggedIn;
    }

    saveUsersToStorage() {
        let usersJSON = JSON.stringify(this.session.users.map(user => user.JSONObject));
        localStorage.setItem('library_users', usersJSON);
    }

    addUser(name, email, password, role, userId = undefined,  membershipId = undefined, borrowedBooks = []) {
        if (this.getUserByEmail(email) !== null) return false;
        if (userId === undefined) userId = this.maxUserId++;
        while (this.getUserByID(userId) !== null) userId = this.maxUserId++
        if (membershipId === undefined) membershipId = userId;
        this.session.users.push(this.session.loggedInUser.registerUser(userId, name, email, password, role, membershipId, borrowedBooks));
        this.saveUsersToStorage();
        return true;
    }

    clearAllUsers() {
        this.session.users.length = 0;
        this.maxUserId = this.#START_USER_ID;
        this.session.users.push(this.session.loggedInUser)
    }

    #loadFromArray(users) {
        users.forEach(user => {
            if (user.userId === 1) this.updateUser(1, user.name, user.email, user.password, user.role);
            this.addUser(user.name, user.email, user.password, user.role, user.userId);
        });
    }

    async resetUsersFromDataSet() {
        const userFetch = await fetch("./src/lib/Users.json");
        let users = [];
        if (userFetch.ok) {
            this.clearAllUsers();
            users = await userFetch.json();
            this.#loadFromArray(users);
        }
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
