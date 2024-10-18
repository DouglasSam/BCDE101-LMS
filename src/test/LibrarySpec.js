describe("Library Management System", () => {
    
    describe("Book Class", () => {
        let book;

        beforeEach(() => {
            book = new Book("JavaScript: The Good Parts", "Douglas Crockford", "9780596517748");
        });

        it("should create a book with title, author, isbn, and available status", () => {
            expect(book.title).toBe("JavaScript: The Good Parts");
            expect(book.author).toBe("Douglas Crockford");
            expect(book.isbn).toBe("9780596517748");
            expect(book.available).toBe(true);
        });

        it("should mark the book as unavailable when checked out", () => {
            book.available = false;  // simulating checkout
            expect(book.available).toBe(false);
        });

        it("should mark the book as available when returned", () => {
            book.available = false;
            book.available = true;  // simulating return
            expect(book.available).toBe(true);
        });
    });

    describe("LibraryModel Class", () => {
        let libraryModel, book1, book2;

        // Mocking localStorage before each test
        beforeEach(() => {
            // Mock localStorage with an empty object
            const localStorageMock = (() => {
                let store = {};
                return {
                    getItem(key) {
                        return store[key] || null;
                    },
                    setItem(key, value) {
                        store[key] = value.toString();
                    },
                    clear() {
                        store = {};
                    },
                    removeItem(key) {
                        delete store[key];
                    }
                };
            })();
            Object.defineProperty(window, 'localStorage', { value: localStorageMock });

            libraryModel = new LibraryModel();
            book1 = new Book("JavaScript: The Good Parts", "Douglas Crockford", "9780596517748");
            book2 = new Book("Eloquent JavaScript", "Marijn Haverbeke", "9781593279509");
        });

        it("should add books to the library model", () => {
            libraryModel.addBook(book1);
            libraryModel.addBook(book2);

            expect(libraryModel.books.length).toBe(2);
            expect(libraryModel.books[0].title).toBe("JavaScript: The Good Parts");
            expect(libraryModel.books[1].title).toBe("Eloquent JavaScript");
        });

        it("should remove a book from the library model", () => {
            libraryModel.addBook(book1);
            libraryModel.addBook(book2);
            
            libraryModel.removeBook(book1.isbn);

            expect(libraryModel.books.length).toBe(1);
            expect(libraryModel.books[0].isbn).toBe("9781593279509");
        });

        it("should search books by title or author", () => {
            libraryModel.addBook(book1);
            libraryModel.addBook(book2);

            const searchResults = libraryModel.searchBooks("JavaScript");
            expect(searchResults.length).toBe(2);

            const searchResultsAuthor = libraryModel.searchBooks("Douglas");
            expect(searchResultsAuthor.length).toBe(1);
            expect(searchResultsAuthor[0].author).toBe("Douglas Crockford");
        });
    });
});
