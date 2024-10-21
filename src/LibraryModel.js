// import Book from './lib/Classes.js';


// Model: Manages data logic and storage
class CatalogueManagementModel {

    #maxBookId = 0;

    constructor(catalogue) {
        this.catalogue = catalogue;
        this.loadBooksFromStorage();
    }

    clearAllBooks() {
        this.catalogue = new Catalogue();
        this.saveBooksToStorage();
    }
    
    async resetBooksFromDataSet() {
        const bookFetch = await fetch("./src/lib/books.json");
        let books = [];
        if (bookFetch.ok) {
            books = await bookFetch.json();
        }
        books.forEach(book => this.addBook(book.title, book.author, book.isbn, book.genre, book.location, book.description, book.available));
    }

    loadBooksFromStorage() {
        let booksJSON = localStorage.getItem('library_books');
        let books = booksJSON ? JSON.parse(booksJSON) : [];
        books.forEach(book => this.addBook(book.title, book.author, book.isbn, book.genre, book.location, book.description, book.availability));
    }

    saveBooksToStorage() {
        localStorage.setItem('library_books', JSON.stringify(this.catalogue.getBooks()));
    }

    addBook(title, author, isbn, genre, location, description, availability = true) {
        this.catalogue.addBook(this.#maxBookId++, title, author, isbn, availability, location, description, genre);
        this.saveBooksToStorage();
    }

    updateBook(title, author, isbn, availability) {
        this.catalogue.updateBook(isbn, title, author, availability)
        this.saveBooksToStorage();
    }
    
    removeBook(id) {
        this.catalogue.deleteBook(id);
        this.saveBooksToStorage();
    }

    searchBooks(query) {
        return this.catalogue.searchBooks(query);
    }
    
    getBooks() {
        return this.catalogue.getBooks();
    }
    
}

class UserManagementModel {
    
}

class BorrowReturnModel {

}

class SearchModel {

    constructor(catalogue) {
        this.catalogue = catalogue;
        this.searchMode = sessionStorage.getItem('searchMode') || "simple";
    }
    
    toggleSearchMode() {
        if (this.searchMode === "simple") this.searchMode = "complex";
        else this.searchMode = "simple";
        sessionStorage.setItem('searchMode', this.searchMode);
    }
    
    searchBooks(title, author, isbn, availableOnly=false) {
        return this.catalogue.searchBooks(title, author, isbn, availableOnly);
    }

    getBooks() {
        return this.catalogue.getBooks();
    }
    
}

// export { BookManagementModel, UserManagementModel, BorrowReturnModel, CatalogModel };

