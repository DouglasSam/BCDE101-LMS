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

    toggleAvailability() {
        this.#availability = !this.#availability;
    }
}
