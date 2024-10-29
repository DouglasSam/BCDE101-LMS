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

    /**
     * Updates this user with the provided details
     * @param newName - The new name of the user
     * @param newEmail - The new email of the user
     * @param newPassword - The new password, or blank string to not update
     * @param role - The role of the user, either 'Member' or 'Librarian'
     * @param newMembershipId - The new membership id of the member (otherwise undefined) if Librarian
     */
    updateUser(newName, newEmail, newPassword, role, newMembershipId = undefined) {
        this.#name = newName;
        this.#email = newEmail;
        if (newPassword !== "")
            this.#password = newPassword;
        if (this instanceof Member) {
            if (newMembershipId !== undefined) {
                this._membershipId = newMembershipId;
            }
        }

    }

    /**
     * Makes sure the user is ready to be deleted
     */
    deleteUser() {
        if (this instanceof Member) {
            this.borrowedBooks.forEach(book => this.returnBook(book));
        }
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

    /**
     * Gets the user id
     * @returns {*}
     */
    get userId() {
        return this.#userId;
    }

    /**
     * Gets the full name of the user
     * @returns {*}
     */
    get name() {
        return this.#name;
    }

    /**
     * Gets the email of the user
     * @returns {*}
     */
    get email() {
        return this.#email;
    }

    /**
     * Gets the role of the user
     * @returns {*}
     */
    get role() {
        return this.#role;
    }


    /**
     * This is the equivalent of saving data to database.
     * @returns {userId, name, email, role, password} The user object as a JSON object
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

}

/**
 * @class Member
 * @classdesc Represents a member in the library system
 * @property {number} #membershipId - The membership id of the member
 * @property {Book[]} #borrowedBooks - The books the member has borrowed
 * @constructor - Creates a new member
 * @extends User
 */
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

    /**
     * Adds a book to the borrowed books of the member if the book is available
     * @param book - The book to be borrowed
     * @returns {boolean} Returns true if the book was borrowed, false if it was not
     */
    borrowBook(book) {
        this.#borrowedBooks.push(book);
    }

    /**
     * Returns a book from the borrowed books of the member
     * @param book - The book to be returned
     */
    returnBook(book) {
        this.#borrowedBooks.push(book);
    }

    /**
     * Checks the borrowing status of all books of the member
     */
    checkBorrowingStatus() {

    }

    /**
     * Gets the membership id of the member
     * @returns {*}
     */
    get membershipId() {
        return this.#membershipId;
    }

    /**
     * Sets the membership id of the member
     * @param value
     */
    set _membershipId(value) {
        this.#membershipId = value;
    }

    /**
     * Gets the borrowed books of the member
     * @returns {*}
     */
    get borrowedBooks() {
        return this.#borrowedBooks;
    }

    /**
     * Sets the borrowed books of the member
     * @param value
     */
    set borrowedBooks(value) {
        this.#borrowedBooks = value;
    }

    /**
     * Adds to the super get JSONObject with member only fields
     * @returns {userId, name, email, role, password, membershipId, borrowedBooks} The member object as a JSON object
     */
    get JSONObject() {
        const obj = super.JSONObject;
        obj.membershipId = this.#membershipId;
        obj.borrowedBooks = this.#borrowedBooks;
        return obj;
    }
}

/**
 * @class Librarian
 * @classdesc Represents a librarian in the library system
 * @constructor - Creates a new librarian
 * @extends User
 *
 */
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

    updateUser(name, email, password, role, membershipId = undefined) {
        super.updateUser(name, email, password, role, membershipId);
    }

    deleteUser() {
        super.deleteUser();
    }
}
