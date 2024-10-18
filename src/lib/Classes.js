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
        this.#genre = genre;
        this.#isbn = isbn;
        this.#availability = availability;
        this.#location = location;
        this.#description = description;
    }

    searchBooks(title, author, isbn, availableOnly=false) {
        if (availableOnly && this.#availability === false) return false;
        if (title) return this.#title.toLowerCase().includes(title.toLowerCase());
        if (author) return this.#author.toLowerCase().includes(author.toLowerCase());
        if (isbn) return this.#isbn === isbn;
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

    addBook(title, author, isbn, availability = true) {
        this.#books.push(new Book(this.#books.length, title, author, isbn, availability));
    }

    // TODO update using ID
    updateBook(isbn, title, author, availability) {
        const index = this.#books.findIndex(book => book.viewBookDetails().isbn === isbn);
        if (index !== -1) {
            this.#books[index] = new Book(this.#books[index], title, author, isbn, availability);
        }
    }

    deleteBook(isbn) {
        this.#books = this.#books.filter(book => book.viewBookDetails().isbn !== isbn);
    }

    searchBooks(title, author, isbn, availableOnly=false) {
        return this.#books.filter(book => book.searchBooks(title, author, isbn, availableOnly)).map(book => book.viewBookDetails());
    }

    getBooks() {
        return this.#books.map(book => book.viewBookDetails());
    }
}