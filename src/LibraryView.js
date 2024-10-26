/**
 * @file LibraryView.js
 * @description Contains the classes that handles the different views for the library system
 * @module LibraryView
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */

/**
 * @class CatalogueManagementView
 * @classdesc Handles the view for the catalogue management
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class CatalogueManagementView {

    /**
     * Renders the base view
     */
    render(bookCount) {
        document.getElementById("main").innerHTML =
            `
        <h2>Add a Book</h2>
        <ul>
            <li><a id="dataSet" href="#">Reset from DataSet</a></li>
            <li><a id="reset" href="#">Reset</a></li>
        </ul>
        <h2>Enter New Book Details</h2>
        <form id="book-form">
              <div class="mb-3">
                <label for="title" class="form-label">Book Title:</label>
                <input type="text" class="form-control" id="title" placeholder="Book Title" required >
              </div>
              
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="author" class="form-label">Author:</label>
                    <input type="text" class="form-control" id="author" placeholder="Author" required >
                  </div>
              
                  <div class="flex-fill">
                    <label for="isbn" class="form-label">ISBN:</label>
                    <input type="text" class="form-control" id="isbn" placeholder="ISBN" required >
                  </div>
              </div>
                  
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="genre" class="form-label">Genre:</label>
                    <input type="text" class="form-control" id="genre" placeholder="Genre (Optional)" >
                  </div>
                           
                  <div class="flex-fill">
                    <label for="location" class="form-label">Location:</label>
                    <input type="text" class="form-control" id="location" placeholder="Location (Optional)" >
                  </div>
              </div>
              
                <div class="mb-3">
                    <label for="description" class="form-label">Description:</label>
                    <textarea class="form-control" id="description" placeholder="Description (Optional)" rows="5"></textarea>
                </div>
              
              <button type="submit" class="btn btn-primary">Add Book</button>

            </form>

        <h2>Filter Books</h2>
        <input type="text" id="search" placeholder="Filter by title or author">
        
        <h2>There are ${bookCount} Books in the catalogue</h2>
        <h3 id="num-books"></h3>
        <table id="book-table" class="table table-striped">
            <thead>
                <tr>
<!--                TODO add book id-->
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Genre</th>
                    <th>Location</th>
                    <th>Available</th>
                    <th>Action</th>
                  
                </tr>
            </thead>
            <tbody>
                <!-- Book rows will be inserted here -->
            </tbody>
        </table>
            `
        this.bookTableBody = document.querySelector('#book-table tbody');
        this.tableCount = document.getElementById('num-books');
    }

    /**
     * Updates the table of books with the list of books provided
     * @param books - The list of books to update the table with
     */
    updateBookTable(books) {
        this.tableCount.innerHTML = `Showing ${books.length} books from the catalogue`;
        this.bookTableBody.innerHTML = '';
        let rowNum = 1;
        books.forEach(book => {
            const row = document.createElement('tr');
            row.id = `book-${rowNum++}`;
            this.bookTableBody.appendChild(row);
            this.SetToRowMode(row.id, book);
        });
    }

    /**
     * Sets the row to the basic view mode with the smaller details and an edit button
     * The row includes:
     *  - title
     *  - author
     *  - isbn
     *  - genre
     *  - location
     *  - availability
     *  - edit button
     * @param rowId - The id of the row to update
     * @param book - The book to display the details from
     */
    SetToRowMode(rowId, book) {
        document.getElementById(rowId).innerHTML =
            `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.genre}</td>
                <td>${book.location}</td>
                <td>${book.availability ? 'Yes' : 'No'}</td>
                <td>
                    <button class="update-btn btn btn-primary" data-book-id="${book.bookId}" data-row-id="${rowId}">Edit or Delete Row</button>
                </td>
            `
    }

    /**
     * Changes the row to the edit mode with a form to update the book details
     * Also allows for deletion of the book
     * @param rowId - The id of the row to change to the update form
     * @param book - The book that to get the details from and will be updated or deleted
     */
    setToEditMode(rowId, book) {
        document.getElementById(rowId).innerHTML = `
        <td colspan="7">
            <form id="book-form-${rowId}">
              <div class="mb-3">
                <label for="title-${rowId}" class="form-label">Book Title:</label>
                <input type="text" class="form-control" id="title-${rowId}" placeholder="Book Title" required value="${book.title}">
              </div>
              
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="author-${rowId}" class="form-label">Author:</label>
                    <input type="text" class="form-control" id="author-${rowId}" placeholder="Author" required value="${book.author}">
                  </div>
              
                  <div class="flex-fill">
                    <label for="isbn-${rowId}" class="form-label">ISBN:</label>
                    <input type="text" class="form-control" id="isbn-${rowId}" placeholder="ISBN" required value="${book.isbn}">
                  </div>
              </div>
                  
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="genre-${rowId}" class="form-label">Genre:</label>
                    <input type="text" class="form-control" id="genre-${rowId}" placeholder="Genre (Optional)" value="${book.genre}">
                  </div>
                           
                  <div class="flex-fill">
                    <label for="location-${rowId}" class="form-label">Location:</label>
                    <input type="text" class="form-control" id="location-${rowId}" placeholder="Location (Optional)" value="${book.location}">
                  </div>
              </div>
              
                <div class="mb-3">
                    <label for="description-${rowId}" class="form-label">Description:</label>
                    <textarea class="form-control" id="description-${rowId}" placeholder="Description (Optional)" rows="${Math.ceil(book.description.length / 100)}">${book.description}</textarea>
                </div>
              
              <div class="d-flex align-items-center justify-content-between gap-3">
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="availability-${rowId}" ${book.availability ? "checked" : ""}>
                <label class="form-check-label" for="availability-${rowId}">Available:</label>
              </div>
              <div>
                  <button type="submit" class="btn btn-warning cancel-edit" data-book-id="${book.bookId}" data-row-id="${rowId}">Cancel</button>
                  <button type="submit" class="btn btn-primary update-book" data-book-id="${book.bookId}" data-row-id="${rowId}">Update Book</button>
                  <button type="submit" class="btn btn-danger remove-book" data-book-id="${book.bookId}" data-isbn="${book.isbn}">Remove Book</button>
              </div>
              </div>
            </form>
        </td>`
    }

    /**
     * Clears the add book form of any input
     */
    clearForm() {
        document.getElementById('book-form').reset();
    }
}

/**
 * @class UserManagementView
 * @classdesc Handles the view for the user management
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class UserManagementView {
    
    /**
     * Renders the base view
     */
    render() {
        document.getElementById("main").innerHTML =
            `
        <h2>Add a User</h2>
        <ul>
            <li><a id="dataSet" href="#">Reset from DataSet</a></li>
            <li><a id="reset" href="#">Reset</a></li>
        </ul>
        <h2>Enter new User Details:</h2>
        <form id="user-form">
              <div class="mb-3">
                <label for="full-name" class="form-label">Full Name:</label>
                <input type="text" class="form-control" id="full-name" placeholder="Full Name" required >
              </div>
              
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email" placeholder="email@email.com" required >
                  </div>
              
                  <div class="flex-fill">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password" placeholder="password" required >
                  </div>
              </div>
                  
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="genre" class="form-label">Role:</label>
                    <select class="form-select" id="role" >
                        <option value="librarian">Librarian</option>
                        <option value="member">Member</option>
                    </select>
                  </div>
              </div>
              <p id="invalid-user" class="text-danger" hidden>A user with that email already exists. Make sure the email is unique.</p>
              <button type="submit" class="btn btn-primary">Register User</button>
            </form>

        <h2>Search Users</h2>
        <input type="text" id="search" placeholder="Search by name, email, or id">
        
        <h2>Users in System</h2>
        <h3 id="num-users"></h3>
        <table id="user-table" class="table table-striped">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>                 
                </tr>
            </thead>
            <tbody>
                <!-- User rows will be inserted here -->
            </tbody>
        </table>
            `
        this.userTableBody = document.querySelector('#user-table tbody');
        this.userCount = document.getElementById('num-users');
        
        
    }

    updateUserTable(users) {
        this.userCount.innerHTML = `There are ${users.length} in the system at the moment`;
        this.userTableBody.innerHTML = '';
        let rowNum = 1;
        users.forEach(user => {
            const row = document.createElement('tr');
            row.id = `book-${rowNum++}`;
            this.userTableBody.appendChild(row);
            this.SetToRowMode(row.id, user);
        });
    }

    /**
     * Sets the row to the basic view mode with the smaller details and an edit button
     * @param rowId - The id of the row to update
     * @param user - The user to display the details from
     */
    SetToRowMode(rowId, user) {
        document.getElementById(rowId).innerHTML =
            `
                <td>${user.userId}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="update-btn btn btn-primary" data-user-id="${user.userId}" data-row-id="${rowId}">Edit or Delete Row</button>
                </td>
            `
    }

    setToEditMode(rowId, user) {
        document.getElementById(rowId).innerHTML = `
        <td colspan="5">
            <form id="user-form-${rowId}">
              <div class="mb-3">
                <label for="full-name-${rowId}" class="form-label">Full Name:</label>
                <input type="text" class="form-control" id="full-name-${rowId}" placeholder="Full Name" required value="${user.name}">
              </div>
              
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="email-${rowId}" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email-${rowId}" placeholder="email@email.com" required value="${user.email}">
                </div>
                
                <div class="flex-fill">
                    <label for="password-${rowId}" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password-${rowId}" placeholder="Leave Blank to not update" >
                </div>
              </div>
              
                <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="flex-fill">
                        <label for="role-${rowId}" class="form-label">Role:</label>
                        <select class="form-select" id="role-${rowId}" disabled>
                            <option value="librarian" ${user.role === "librarian" ? "selected" : ""}>Librarian</option>
                            <option value="member" ${user.role === "member" ? "selected" : ""}>Member</option>
                        </select>
                    </div>
                </div>
                
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <button type="submit" class="btn btn-warning cancel-edit" data-user-id="${user.userId}" data-row-id="${rowId}">Cancel</button>
                    <button type="submit" class="btn btn-primary update-user" data-user-id="${user.userId}" data-row-id="${rowId}">Update User</button>
                    <button type="submit" class="btn btn-danger remove-user" data-user-id="${user.userId}">Remove User</button>
                </div>
            </form>
        </td>
        `
    }

    /**
     * Clears the add user form of any input
     */
    clearForm() {
        document.getElementById('user-form').reset();
    }

}

/**
 * @class ReturnView
 * @classdesc Handles the view for the return of books by users
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class ReturnView {

    /**
     * Renders the base view
     */
    render() {
        document.getElementById("main").innerHTML =
            "<h2>Welcome to the Borrow/Return Page</h2>";
    }

}

/**
 * @class SearchView
 * @classdesc Handles the view for searching the catalogue
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class SearchView {

    /**
     * Renders the base view
     * @param numBooks - The number of books in the catalogue
     * @param searchMode - The search mode to render the view in
     */
    render(numBooks, searchMode) {
        document.getElementById("main").innerHTML =`
            <h2>Search our catalogue</h2>
            <h3>${numBooks} books available to search through.</h3>
            <p>Use form below to get searching<br>
            Just press search in simple mode to return all books</p>
            <a id="search-toggle" href="#"></a>
            <div id="search-form"></div>
            <h2 id="no-results-found" hidden></h2>
            <div id="search-results" hidden>
                <h2 id="search-title"></h2>
                <table id="book-table" class="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Available</th>
                            <th>View Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Book rows will be inserted here -->
                    </tbody>
                </table>
            </div>
            `

        this.noResults = document.getElementById("no-results-found");
        this.searchResults = document.getElementById("search-results");
        this.searchTitle = document.getElementById("search-title");
        this.bookTableBody = document.querySelector('#book-table tbody');
        searchMode === "simple" ? this.simpleSearch() : this.complexSearch();
    }

    /**
     * Renders the simple search form
     */
    simpleSearch() {
        this.searchResults.hidden = true;
        document.getElementById("search-toggle").innerHTML = "Go to Complex Search Mode"
        document.getElementById("search-form").innerHTML =
            '<h3>Enter Search Term</h3>' +
            `
            <form id="simple-search-form">
              <div class="mb-3 d-flex gap-3 align-items-center">
              <div>
                <label for="simple-search-input" class="form-label">Search by title, author or isbn:</label>
                </div>
                <div class="flex-fill">
                <input type="text" class="form-control" id="simple-search-input" placeholder="Search by title, author or isbn">
                </div>
                <button type="submit" class="btn btn-primary">Search</button>
              </div>
              
            </form>
            `;

    }

    /**
     * Renders the complex search form
     */
    complexSearch() {
        this.searchResults.hidden = true;
        document.getElementById("search-toggle").innerHTML = "Go to Simple Search Mode"
        document.getElementById("search-form").innerHTML =
            '<h3>Enter Search Fields</h3>' +
            `<p>Insert any terms into any of the below options and results will find all books where your query if found in that field<br>
            Leave fields blank if you do not want to search by that field. All are optional, at least one must be filled or selected.</p>    
            <form id="complex-search-form">
              <div class="mb-1">
                <label for="title" class="form-label">Book Title:</label>
                <input type="text" class="form-control" id="title" placeholder="Book Title"  >
              </div>
              
              <div class="d-flex align-items-center gap-3 mb-1">
                  <div class="flex-fill">
                    <label for="author" class="form-label">Author:</label>
                    <input type="text" class="form-control" id="author" placeholder="Author"  >
                  </div>
              
                  <div class="flex-fill">
                    <label for="isbn" class="form-label">ISBN:</label>
                    <input type="text" class="form-control" id="isbn" placeholder="ISBN"  >
                  </div>
              </div>
                  
              <div class="d-flex align-items-center gap-3 mb-1">
                  <div class="flex-fill">
                    <label for="genre" class="form-label">Genre:</label>
                    <input type="text" class="form-control" id="genre" placeholder="Genre" >
                  </div>
                           
                  <div class="flex-fill">
                    <label for="location" class="form-label">Location:</label>
                    <input type="text" class="form-control" id="location" placeholder="Location" >
                  </div>
              </div>
              
                <div class="mb-3">
                    <label for="description" class="form-label">Description:</label>
                    <input class="form-control" id="description" placeholder="Description">
                </div>
                
                <div class="mb-3 form-check">
                    <input id="search-available" type="checkbox" class="form-check-input">
                    <label for="search-available" class="form-check-label">Only Search, or List all, Available Books:</label>
                </div>
                
              <button type="submit" class="btn btn-primary">Search For Book</button>

            </form>`;
    }

    /**
     * Displays an error message to the user if there are no books found
     */
    noBookFoundSearch() {
        this.searchResults.hidden = true;
        this.noResults.hidden = false;
        this.searchResults.hidden = true;
        this.noResults.innerHTML = `No results found, please try again with a different search term or check your spelling.`;
    }

    /**
     * Displays the search results to the user
     * @param results - The list of books that match the search query
     */
    validSearch(results) {
        this.searchTitle.hidden = false;
        this.searchTitle.innerHTML = `Found ${results.length} books:`;
        this.noResults.hidden = true;
        this.searchResults.hidden = false;

        this.bookTableBody.innerHTML = '';
        let count = 1;
        results.forEach(result => {
            const row = document.createElement('tr');
            row.id = `book-${count++}`;
            this.bookTableBody.appendChild(row);
            this.setToNormalRowMode(row.id, result);
        });
    }

    /**
     * Sets the row to the normal view mode with the smaller details and a view details button
     * The row includes:
     * - title
     * - author
     * - isbn
     * - availability
     * - view details button
     * @param rowId - The id of the row to display
     * @param book - The book to display the details from
     */
    setToNormalRowMode(rowId, book) {
        const row = document.getElementById(rowId);
        row.innerHTML = `<td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.availability ? 'Yes' : 'No'}</td>
                <td><button class="view-details-btn btn btn-primary" data-row-id="${row.id}" data-book-id="${book.bookId}" >View Detials/borrow</button></td>`
    }

    /**
     * Sets the row to the details view mode with all the details of the book
     * also allows a user to borrow the book
     * @param rowId
     * @param result
     * @constructor
     */
    SetToDetailsRowMode(rowId, result) {
        const row = document.getElementById(rowId);
        row.innerHTML =
            `<td colspan="5">
            <h3>${result.title}</h3>
            <p><b>Author:</b> ${result.author}</p>
            <p><b>Genre:</b> ${result.genre}</p>
            <p><b>ISBN:</b> ${result.isbn}</p>
            <p><b>Location:</b> ${result.location}</p>
            <p><b>Description:</b> ${result.description}</p>
            <p><b>Availability:</b> ${result.availability ? 'Yes' : 'No'}</p>
            <button class="borrow-btn" data-row-id="${row.id}" data-book-id="${result.bookId}">Borrow</button>
            <button class="exit-detail-view" data-row-id="${row.id}" data-book-id="${result.bookId}">Exit Detail View</button>
            </td>`
    }

}

/**
 * @class HomeView
 * @classdesc Handles the view for the home page/first loading page
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class HomeView {

    /**
     *
     * @param loggedInUser
     */
    render(loggedInUser) {
        let homeHTML = "<h2>Welcome to the Library Management System</h2>";
        if (loggedInUser) {
            homeHTML += `<p>${loggedInUser.name} you are signed in, please use the navigation to access the system</p>`;
        } else {
            homeHTML += "<p>Please log in to access the system</p>";
            homeHTML += `
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-floating">
                  <input type="email" class="form-control" id="email" placeholder="ēmail@email.com">
                  <label for="email">Email</label>
                </div>
                <div class="form-floating">
                  <input type="password" class="form-control" id="password" placeholder="Password">
                  <label for="password">Password</label>
                </div>
            
                <div class="checkbox mb-3">
                  <label>
                    <input type="checkbox" id="remember-me"> Remember me
                  </label>
                </div>
                <p id="invalid-login" class="text-danger" hidden>Invalid Email or Password, Please try again</p>
                <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
              </form>
            `;
        }
        document.getElementById("main").innerHTML = homeHTML;
    }

}
