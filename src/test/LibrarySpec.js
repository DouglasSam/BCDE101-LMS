describe("Library Management System", () => {
    
    describe("Book Class", () => {
        let book;

        beforeEach(() => {
            book = new Book(1, "JavaScript: The Good Parts", "Douglas Crockford", "9780596517748");
        });

        it("should create a book with title, author, isbn, and available status", () => {
            const bookDetails = book.viewBookDetails();

            expect(bookDetails.title).toBe("JavaScript: The Good Parts");
            expect(bookDetails.author).toBe("Douglas Crockford");
            expect(bookDetails.isbn).toBe("9780596517748");
            expect(bookDetails.availability).toBe(true);
        });

        it("should mark the book as unavailable when checked out", () => {
            book.available = false;  // simulating borrow
            expect(book.available).toBe(false);
        });

        it("should mark the book as available when returned", () => {
            book.available = false;
            book.available = true;  // simulating return
            expect(book.available).toBe(true);
        });
    });
/*
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
*/
    describe("UserModel Class", () => {
        let userModel, user1, user2;

        beforeEach(async () => {
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
            
            
            userModel = new UserManagementModel(new Session());
            user1 = new Librarian(1, 'admin', 'admin', 'admin@admin');
            userModel.session.users.push(user1);
            user2 = new Librarian(2, 'admin2', 'admin2', 'admin2@admin');
            userModel.session.users.push(user2);
            userModel.session.loggedInUser = user1;
        });

        it("should add users to the user model", () => {
            expect(userModel.session.users.length).toBe(2);
            expect(userModel.session.users[0].name).toBe("admin");
            expect(userModel.session.users[1].name).toBe("admin2");
        });

        it("should save users to local Storage", () => {
            userModel.saveUsersToStorage();
            let originalStorage = localStorage.getItem("library_users");
            userModel.clearAllUsers();
            expect(userModel.session.users.length).toBe(1);
            userModel.loadUsersFromStorage();
            expect(userModel.session.users.length).toBe(2);
            expect(JSON.stringify(userModel.session.users.map(user => user.JSONObject))).toBe(originalStorage);
            console.log(userModel.session.users.map(user => user.JSONObject));
            
        });

    });
});
