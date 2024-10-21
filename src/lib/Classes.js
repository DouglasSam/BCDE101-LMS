// Book Class
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

class Catalogue {
    #books;

    constructor() {
        this.#books = [];
    }

    addBook(id, title, author, isbn, availability = true, location = "Library", description = "", genre = "undefined", ) {
        this.#books.push(new Book(id, title, author, isbn, availability, location, description, genre));
    }

    // TODO update using ID
    updateBook(isbn, title, author, availability) {
        const index = this.#books.findIndex(book => book.viewBookDetails().isbn === isbn);
        if (index !== -1) {
            this.#books[index] = new Book(this.#books[index], title, author, isbn, availability);
        }
    }

    deleteBook(bookID) {
        this.#books = this.#books.filter(book => book.viewBookDetails().bookId != bookID);
    }

    /**
     * 
     * @param params Object that contains search queries, for example searching for id you would pass in { id: id } and searching for multiple queries you would pass in { id: id, title: title } etc.
     * @returns {*}
     */
    searchBooks(params) {
        return this.#books.filter(book => book.searchBooks(params)).map(book => book.viewBookDetails());
    }

    getBooks() {
        return this.#books.map(book => book.viewBookDetails());
    }
}