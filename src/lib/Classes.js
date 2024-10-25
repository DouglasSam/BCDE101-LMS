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

// Parent Class: User
class User {

    #userId;
    #name;
    #email;
    #password;
    #role;
    #keyPair;
    #loggedIn

    /**
     *
     * @param userId
     * @param name
     * @param email
     * @param role
     */
    constructor(userId, name, email, role) {
        this.#userId = userId;
        this.#name = name;
        this.#email = email;
        this.#role = role;
        this.#loggedIn = false;
    }

    async initKeyPair() {
        this.#keyPair = await this.generateKeyPair();
    }
    
    set encryptedPassword(password) {
        this.#setEncryptedPassword(password).then(decryptedPassword => this.#password = decryptedPassword);
    }
    
    async #setEncryptedPassword(password) {
        return await this.#decryptMessage(password);
    }

    registerUser() {
        
    }

    updateUser() {
        
    }

    deleteUser() {
        
    }

    async checkCredentials(email, encryptedPassword) {
        return this.#email === email && this.#password === await this.#decryptMessage(encryptedPassword);
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
    
    get publicKey() {
        return this.#keyPair.publicKey;
    }

    async #decryptMessage(ciphertext) {
        return await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            this.#keyPair.privateKey,
            ciphertext
        ).then(decrypted => {
        let dec = new TextDecoder();
        return dec.decode(decrypted); });
    }

    /**
     * Generates a new RSA key pair for the user
     * Code modified from https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/rsa-oaep.js
     * Referenced from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#rsa-oaep
     * @returns {Promise<CryptoKeyPair>} The generated key pair encased in a promise
     */
    async generateKeyPair() {
        return window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                // Consider using a 4096-bit key for systems that require long-term security
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        )
    }
    
}


class Member extends User {

    #membershipId;
    #borrowedBooks;
    
    constructor(userId, name, email, password, membershipId, borrowedBooks=[]) {
        super(userId, name, email, password, 'Member'); 
        this.#membershipId = membershipId; 
        this.#borrowedBooks = borrowedBooks; 
    }

    borrowBook(book) {
        
    }

    returnBook(book) {
        
    }

    checkBorrowingStatus() {
        
    }
}


class Librarian extends User {
    
    constructor(userId, name, email) {
        super(userId, name, email, 'Librarian'); 
    }

    addBook(book) {
        
    }

    updateBook(book) {
        
    }

    deleteBook(book) {
        
    }

    
    registerUser() {
        super.registerUser(); 
    }

    updateUser() {
        super.updateUser(); 
    }

    deleteUser() {
        super.deleteUser(); 
    }
}
