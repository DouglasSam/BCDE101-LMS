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

    /**
     * Handles logging out the current logged-in user
     */
    logout() {
        this.session.loggedInUser = null;
        localStorage.removeItem('loggedInUser');
    }

    /**
     * Loads the logged-in user if they clicked remember me
     */
    loadLoggedInUser() {
        const loggedInUserJSON = localStorage.getItem('loggedInUser');
        const email = loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;
        if (email) {
            this.session.loggedInUser = this.getUserByEmail(email);
        }
    }

    /**
     * Saves the logged-in user to the local storage if they clicked remember me
     */
    saveLoggedInUser() {
        localStorage.setItem('loggedInUser', JSON.stringify(this.session.loggedInUser.email));
    }

    /**
     * Logs in a user, if the provided email and password matched a librarian credentials 
     * @param email - Of the user to log in
     * @param password - Of the user to log in
     * @param rememberMe - Whether the user wants to be remembered when the page reloads 
     * @returns {boolean} - Whether the user was successfully logged in
     */
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

    /**
     * Gets a user by their email
     * @param email - The email of the user to get
     * @returns {User|null} - The user object or null if not found
     */
    getUserByEmail(email) {
        const filtered = this.session.users.filter(user => user.email === email);
        return filtered.length === 1 ? filtered[0] : null;
    }

}

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

/**
 * @class UserManagementModel
 * @classdesc Handles the management of the users
 *
 * @constructor - Creates a new UserManagementModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class UserManagementModel {

    // User ID to start from when adding users
    #START_USER_ID = 100000;
    // The current free user ID
    maxUserId = this.#START_USER_ID;

    constructor(session) {
        this.session = session;
        this.loadUsersFromStorage();
        
    }

    /**
     * Removes a user from the system
     * @param user - The user to remove
     * @returns {boolean} - Whether the user was successfully removed
     */
    removeUser(user) {
        if (user === null) return false;
        if (this.session.loggedInUser.userId === user.userId) return false;
        this.session.users = this.session.users.filter(u => u.userId !== user.userId);
        this.saveUsersToStorage();
        return true;
    }

    /**
     * Updates a user with the given details
     * @param userId - The user ID of the user to update
     * @param newName - The new name of the user
     * @param newEmail - The email 
     * @param newPassword - The new password
     * @param role - The original role of the user
     * @param newMembershipId - The membership ID of the user if it is a member
     * @returns {User|boolean} - The updated user or false if not updated
     */
    updateUser(userId, newName, newEmail, newPassword, role, newMembershipId=undefined) {
        const user = this.getUserByID(userId);
        if (user === null) return false;
        if (newEmail !== user.email && this.getUserByEmail(newEmail) !== null) return false
        if (newMembershipId !== undefined && this.session.users.filter(user => {
            if (user.membershipId === undefined) return false;
            return user.membershipId.toString() === newMembershipId
        }).length > 0) return false;
        user.updateUser(newName, newEmail, newPassword, role, newMembershipId);
        if (this.session.loggedInUser.userId === userId) this.session.loggedInUser = user;
        this.saveUsersToStorage();
        return user;
    }

    /**
     * Gets a user by their email
     * @param email - The email of the user to get
     * @returns {User|null} - The user object or null if not found
     */
    getUserByEmail(email) {
        const filtered = this.session.users.filter(user => user.email === email);
        return filtered.length === 1 ? filtered[0] : null;
    }

    /**
     * Gets a user by their ID
     * @param userId - The ID of the user to get
     * @returns {User|null} - The user object or null if not found
     */
    getUserByID(userId) {
        return this.session.getUserByID(userId);
    }

    /**
     * Search users by the name email or id
     * @param query - The query to search for
     * @returns {User[]} - A list of users that match the query
     */
    searchUsers(query) {
        return this.session.users.filter(user => {
            let nameEmailUserId = user.name.includes(query) || user.email.includes(query) || user.userId.toString().includes(query);
            if (user.role === "Member") {
                return nameEmailUserId || user.membershipId.toString().includes(query);
            }
            return nameEmailUserId;
        });
    }

    /**
     * Loads the users from local storage into the session if any
     */
    loadUsersFromStorage() {
        const loggedIn = this.session.loggedInUser;
        this.session.loggedInUser = new Librarian(0, 'system', 'system@system', 'system');
        let usersJSON = localStorage.getItem('library_users');
        let users = usersJSON ? JSON.parse(usersJSON) : [];
        this.#loadFromArray(users);
        this.session.loggedInUser = loggedIn;
        // if (users !== []) {
        //     if (loggedIn.userId !== 1) {
        //         if (users.find(user => user.userId === 1) === undefined) {
        //             this.session.users = this.session.users.filter(user => user.userId !== 1);
        //         }
        //     }
        // }
        //
    }

    /**
     * Saves the users in the session to local storage
     */
    saveUsersToStorage() {
        let usersJSON = JSON.stringify(this.session.users.map(user => user.JSONObject));
        localStorage.setItem('library_users', usersJSON);
    }

    /**
     * Adds a user to the system, each user must have unique userId, email and members must have unique membershipId
     * @param name - The name of the user
     * @param email - The email of the user
     * @param password - The password of the user
     * @param role - The role of the user either Member or Librarian
     * @param userId - The user ID of the user, or undefined to let the system assign one
     * @param membershipId - The membership ID of the member, or undefined to let the system assign one 
     *                      which will be the same as the userId
     * @param borrowedBooks - The books that the member has borrowed, or creates empty list if none 
     * @returns {boolean} - Whether the user was successfully added
     */
    addUser(name, email, password, role, userId = undefined,  membershipId = undefined, borrowedBooks = []) {
        if (this.getUserByEmail(email) !== null) return false;
        if (userId === undefined) userId = this.maxUserId++;
        while (this.getUserByID(userId) !== null) userId = this.maxUserId++
        if (membershipId === undefined) membershipId = userId;
        this.session.users.push(this.session.loggedInUser.registerUser(userId, name, email, password, role, membershipId, borrowedBooks));
        this.saveUsersToStorage();
        return true;
    }

    /**
     * Clears all users from the system. Irreversible.
     */
    clearAllUsers() {
        this.session.users.length = 0;
        this.maxUserId = this.#START_USER_ID;
        this.session.users.push(this.session.loggedInUser)
    }

    /**
     * Loads the users from the array into the session
     * @param users - The array of users to load
     */
    #loadFromArray(users) {
        users.forEach(user => {
            if (user.userId === 1) this.updateUser(1, user.name, user.email, user.password, user.role);
            this.addUser(user.name, user.email, user.password, user.role, user.userId, user.membershipId, user.borrowedBooks);
        });
    }

    /**
     * Resets the users in the system to the default dataset. Will keep the default admin user.
     * @returns {Promise<void>} - A promise that resolves when the users have been reset
     */
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
 * @class BorrowRecordManagerModel
 * @classdesc Handles the user returning books
 *
 * @constructor - Creates a new ReturnModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class BorrowRecordManagerModel {

}

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
    
    borrowBook(book, userId) {
        const borrowerRecord = BorrowingRecord.createRecord(this.session, book.bookId, userId);
        return borrowerRecord !== false;

    }

}
