/**
 * @file Classes.js
 * @description Contains the classes that handles objects for the library system
 * @module Classes
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */

/**
 * @class Book
 * @classdesc Represents a book in the catalogue
 * @property {number} #bookId - The unique identifier for the book
 * @property {string} #title - The title of the book
 * @property {string} #author - The author of the book
 * @property {string} #genre - The genre of the book
 * @property {string} #isbn - The ISBN of the book
 * @property {boolean} #availability - Whether the book is available
 * @property {string} #location - The location of the book
 * @property {string} #description - The description of the book
 * @constructor - Creates a new book
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class Book {
    #bookId;
    #title;
    #author;
    #genre;
    #isbn;
    #availability;
    #location;
    #description;

    constructor(bookId, title, author, isbn, availability = true, location = "Library", description = "", genre = "undefined", ) {
        this.#bookId = bookId;
        this.#title = title;
        this.#author = author;
        this.#isbn = isbn;
        this.#genre = genre;
        this.#location = location;
        this.#description = description;
        this.#availability = availability;
    }

    /**
     * Will return whether this book matches the search query
     * Allows for multiple different types of searches
     * e.g. Search for title, author, or isbn or search just in title, or search in any combination
     * the search does not handle exact matches but handles partial matches instead
     * @param {Object} params Object that contains search queries, for example searching for id you would pass in
     *                      { id: id } and searching for multiple queries you would pass in { id: id, title: title } etc.
     * @param query - Searches in title, author, or isbn
     * @param id - Searches for the book id only one that returns if exact match
     * @param title - Searches in title
     * @param author - Searches in author
     * @param isbn - Searches in isbn
     * @param genre - Searches in genre
     * @param location - Searches in location
     * @param description - Searches in description
     * @param availableOnly - Will only return books that are available even if the other parameters match
     * @returns {this is *[]|boolean} Returns true if the book matches the search query, false if it does not
     */
    searchBooks({ query = false, id = false, title = false, author = false, isbn = false, genre = false, location = false, description = false, availableOnly = false } = {}) {
        // console.log(id, this.#bookId);
        if (query !== false) {
            return this.#title.toLowerCase().includes(query.toLowerCase()) ||
                this.#author.toLowerCase().includes(query.toLowerCase()) ||
                this.#isbn.toString().includes(query.toString());
        }
        if (availableOnly && this.#availability === false) return false;

        const searchResults = [];
        if (id !== false) {
            searchResults.push(this.#bookId.toString() === id.toString());
        }
        if (title !== false)
            searchResults.push(this.#title.toLowerCase().includes(title.toLowerCase()));
        if (author !== false)
            searchResults.push(this.#author.toLowerCase().includes(author.toLowerCase()));
        if (isbn !== false)
            searchResults.push(this.#isbn.toString().includes(isbn.toString()));
        if (genre !== false)
            searchResults.push(this.#genre.toLowerCase().includes(genre.toLowerCase()));
        if (location !== false)
            searchResults.push(this.#location.toLowerCase().includes(location.toLowerCase()));
        if (description !== false)
            searchResults.push(this.#description.toLowerCase().includes(description.toLowerCase()));
        if (availableOnly !== false)
            searchResults.push(this.#availability);
        if (searchResults.length === 0) return false;
        return searchResults.every(result => result);
    }

    /**
     * Gets the private fields and returns them as an object for reading all details of the book
     * @returns {{author, isbn, genre, description, location, availability, title, bookId}} - The book details
     */
    viewBookDetails() {
        return {
            bookId: this.#bookId,
            title: this.#title,
            author: this.#author,
            genre: this.#genre,
            isbn: this.#isbn,
            availability: this.#availability,
            location: this.#location,
            description: this.#description
        };
    }
}

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
}

/**
 * @class User
 * @classdesc Represents a user in the library system
 * @property {number} #userId - The unique identifier for the user
 * @property {string} #name - The name of the user
 * @property {string} #email - The email of the user
 * @property {string} #password - The password of the user
 * @property {string} #role - The role of the user, either 'Member' or 'Librarian'
 * @constructor - Creates a new user, does not generate a key pair or set the password.
 */
class User {

    #userId;
    #name;
    #email;
    #password;
    #role;
    
    constructor(userId, name, email, password, role) {
        this.#userId = userId;
        this.#name = name;
        this.#email = email;
        this.#password = password;
        this.#role = role;
    }
    
    /**
     * Registers a user with the provided details
     * Also encrypts the password with the generated public key
     * @param userId - The unique identifier for the user
     * @param name - The name of the user
     * @param email - The email of the user
     * @param password - The password of the user
     * @param role - The role of the user, either 'Member' or 'Librarian'
     * @param membershipId - The membership id of the member (otherwise undefined)
     * @param borrowedBooks - The books that the member has borrowed (otherwise undefined)
     * @returns {Promise<Member|Librarian>} The new user
     */
    registerUser(userId, name, email, password, role, membershipId = undefined, borrowedBooks = undefined) {
        let user;
        if (role.toLowerCase() === 'librarian') {
            user = new Librarian(userId, name, email, password);
        } else {
            user = new Member(userId, name, email, password, membershipId, borrowedBooks);
        }
        
        return user;
    }

    updateUser(name, email, password, role, membershipId = undefined, borrowedBooks = undefined) {
        this.#name = name;
        this.#email = email;
        if (password !== "")
        this.#password = password;
        if (role.toLowerCase() === 'member') {
            if (membershipId !== undefined) {
                this.membershipId = membershipId;
            }
            if (borrowedBooks !== undefined) {
                this.borrowedBooks = borrowedBooks;
            }
        }

    }

    deleteUser() {

    }

    /**
     * Checks the credentials of the user based on a provided email
     * and a password with another password
     * @param email - The email provided by the user
     * @param password - The password provided by the user
     * @returns {boolean} Returns true if the credentials match, false if they do not
     */
    checkCredentials(email, password) {
        return this.#email === email && this.#password === password;
    }

    get userId() {
        return this.#userId;
    }

    get name() {
        return this.#name;
    }

    get email() {
        return this.#email;
    }

    get role() {
        return this.#role;
    }


    /**
     * This is the equivalent of saving data to database.
     * @returns {{password, role, name, publicKey, userId, email}} The user object as a JSON object
     */
    get JSONObject() {

        return {
            userId: this.#userId,
            name: this.#name,
            email: this.#email,
            role: this.#role,
            password: this.#password
        };

    }

    /**
     * This is the equivalent of reading data from a database.
     * Used for loading from local storage
     * @param obj
     * @constructor
     */
    set JSONObject(obj) {
        this.#userId = obj.userId;
        this.#name = obj.name;
        this.#email = obj.email;
        this.#role = obj.role;
        this.#password = obj.password;
    }
}


class Member extends User {

    #membershipId;
    #borrowedBooks;

    constructor(userId, name, email, password, membershipId, borrowedBooks=[]) {
        super(userId, name, email, password, 'Member');
        this.#membershipId = membershipId;
        this.#borrowedBooks = borrowedBooks;
        this.#membershipId = membershipId;
        this.#borrowedBooks = borrowedBooks;
    }

    borrowBook(book) {

    }

    returnBook(book) {

    }

    checkBorrowingStatus() {

    }


    get membershipId() {
        return this.#membershipId;
    }

    set membershipId(value) {
        this.#membershipId = value;
    }

    get borrowedBooks() {
        return this.#borrowedBooks;
    }

    set borrowedBooks(value) {
        this.#borrowedBooks = value;
    }

    get JSONObject() {
        const obj = super.JSONObject;
        obj.membershipId = this.#membershipId;
        obj.borrowedBooks = this.#borrowedBooks;
        return obj;
    }
}


class Librarian extends User {

    constructor(userId, name, email, password) {
        super(userId, name, email, password, 'Librarian');
    }

    addBook(book) {

    }

    updateBook(book) {

    }

    deleteBook(book) {

    }


    registerUser(userId, name, email, password, role, membershipId = undefined, borrowedBooks=[]) {
        return super.registerUser(userId, name, email, password, role, membershipId, borrowedBooks);
    }

    updateUser(name, email, password, role, membershipId = undefined, borrowedBooks = undefined) {
        super.updateUser(name, email, password, role, membershipId, borrowedBooks);
    }

    deleteUser() {
        super.deleteUser();
    }
}

/**
 * Stores variables shared across the different models
 */
class Session {
    constructor() {
        this.users = [];
        this.loggedInUser = null;
    }
}
