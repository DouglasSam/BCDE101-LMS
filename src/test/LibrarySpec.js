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
            userModel.session.saveUsersToStorage();
            let originalStorage = localStorage.getItem("library_users");
            userModel.clearAllUsers();
            expect(userModel.session.users.length).toBe(1);
            userModel.loadUsersFromStorage();
            expect(userModel.session.users.length).toBe(2);
            expect(JSON.stringify(userModel.session.users.map(user => user.JSONObject))).toBe(originalStorage);
            console.log(userModel.session.users.map(user => user.JSONObject));
            
        });

        it("should be able to load data from the data set", async () => {
            expect(userModel.session.users.length).toBe(2);
            expect(userModel.session.users[0].name).toBe("admin");
            expect(userModel.session.users[1].name).toBe("admin2");
            // console.log(userModel.session.loggedInUser)
            await userModel.resetUsersFromDataSet();
            expect(userModel.session.users.length).toBe(101);
            expect(userModel.session.users[0]).toBe(user1);
            expect(userModel.session.users[1].name).toBe('Henry Le');

        });
        
        it("should be able to search and return correct results", async () => {
            await userModel.resetUsersFromDataSet();
            // search by name
            let searchResults = userModel.searchUsers('Henry');
            expect(searchResults.length).toBe(2);
            // search by email domain
            searchResults = userModel.searchUsers('google');
            expect(searchResults.length).toBe(16);
            //search by id
            //every id has a 1 with the base dataset
            searchResults = userModel.searchUsers('1');
            expect(searchResults.length).toBe(101);
            searchResults = userModel.searchUsers('99');
            expect(searchResults.length).toBe(1);
            expect(searchResults[0].name).toBe('Lesley Trujillo');
        });

        
        it ("should be able to update a user successfully", async () => {
            await userModel.resetUsersFromDataSet();
            // update a librarian
            // chosen librarian
            // "name": "Dieter Britt",
            //     "email": "dieterbritt@aol.com",
            //     "password": "BHO22SLW1MC",
            //     "role": "librarian"
            let user = userModel.getUserByEmail("dieterbritt@aol.com");
            let userId = user.userId;
            let newName = "Changed Name";
            let newEmail = user.email;
            let newPassword = "";
            let newRole = "Librarian";
            let newUser = userModel.updateUser(userId, newName, newEmail, newPassword, newRole);
            expect(newUser.name).toBe(newName);
            expect(newUser.email).toBe(newEmail);
            expect(newUser.checkCredentials(newEmail, newPassword)).toBeFalse();
            expect(newUser.role).toBe(newRole);
            expect(newUser.userId).toBe(userId);
            expect(newUser.membershipId).toBe(undefined);
            // update everything for a librarian
            // chosen librarian
            // "name": "Oleg Pace",
            // 		"email": "olegpace@aol.ca",
            // 		"password": "MYP46WDP3FG",
            // 		"role": "librarian"
            user = userModel.getUserByEmail("olegpace@aol.ca");
            userId = user.userId;
            newName = "Test changed";
            newEmail = 'test@test.com';
            newPassword = "asdf";
            newRole = "Librarian";
            newUser = userModel.updateUser(userId, newName, newEmail, newPassword, newRole);
            expect(newUser.name).toBe(newName);
            expect(newUser.email).toBe(newEmail);
            expect(newUser.checkCredentials(newEmail, newPassword)).toBeTrue();
            expect(newUser.role).toBe(newRole);
            expect(newUser.userId).toBe(userId);
            expect(newUser.membershipId).toBe(undefined);
            //Cannot change to an email that already exists
            // chosen librarian:
            // "name": "Basia Shaffer",
            //     "email": "basiashaffer@outlook.edu",
            //     "password": "YKQ76IVJ4UK",
            //     "role": "librarian"
            user = userModel.getUserByEmail("basiashaffer@outlook.edu");
            userId = user.userId;
            newName = "Test changed";
            newEmail = 'test@test.com';
            newPassword = "asdf";
            newRole = "Librarian";
            newUser = userModel.updateUser(userId, newName, newEmail, newPassword, newRole);
            expect(newUser).toBeFalse();
            //Edit a member
            // chosen member:
            // "name": "Ezekiel Snow",
            // 		"email": "ezekielsnow@yahoo.ca",
            // 		"password": "EHW54IDU9SO",
            // 		"role": "member"
            user = userModel.getUserByEmail("ezekielsnow@yahoo.ca");
            userId = user.userId;
            newName = "member change";
            newEmail = 'test@member.com';
            newPassword = "asdf";
            newRole = "Member";
            let newMembershipId = "1234";
            newUser = userModel.updateUser(userId, newName, newEmail, newPassword, newRole, newMembershipId);
            expect(newUser.name).toBe(newName);
            expect(newUser.email).toBe(newEmail);
            expect(newUser.checkCredentials(newEmail, newPassword)).toBeTrue();
            expect(newUser.role).toBe(newRole);
            expect(newUser.userId).toBe(userId);
            expect(newUser.membershipId).toBe(newMembershipId);
            //cannot have the same membershipId
            // "name": "Ramona Rivas",
            //     "email": "ramonarivas8711@icloud.net",
            //     "password": "RFP19IQB6QO",
            //     "role": "member"
            user = userModel.getUserByEmail("ramonarivas8711@icloud.net");
            userId = user.userId;
            newName = "Ramona Rivas";
            newEmail = 'ramonarivas8711@icloud.netx';
            newPassword = "";
            newRole = "Member";
            newMembershipId = "1234";
            newUser = userModel.updateUser(userId, newName, newEmail, newPassword, newRole, newMembershipId);
            // console.log(userModel.session.users);
            expect(newUser).toBeFalse();

            
        });
    });

    describe("borrowing", () => {
        let session, searchModel;

        beforeEach(() => {
            session = new Session();
            searchModel = new SearchModel(session);
            session.users.push(new Member(1, 'test', 'test', 'test', '1234'));
            session.catalogue.addBook(1, "JavaScript: The Good Parts", "Douglas Crockford", "9780596517748");
        });

        it("should be able to borrow a book", () => {
            const book = searchModel.searchBooks({id: 1})[0];
            let borrowRecord = searchModel.borrowBook(book, 1234);
            expect(borrowRecord).toBeTrue();
            expect(session.borrowingRecords.length).toBe(1)
            expect(searchModel.searchBooks({id: 1})[0].availability).toBeFalse();
            expect(session.users[0].borrowedBooks.length).toBe(1);
        });

    });
});
