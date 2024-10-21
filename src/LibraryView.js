
// View: Handles UI updates and rendering
class HomeView {

    render() {
        document.getElementById("main").innerHTML =
            "<h2>Welcome to the Library Management System</h2>";
    }

}

class UserManagementView {

    render() {
        document.getElementById("main").innerHTML =
            "<h2>Welcome to the User Management Page</h2>";
    }

}

class BorrowReturnView {

    render() {
        document.getElementById("main").innerHTML =
            "<h2>Welcome to the Borrow/Return Page</h2>";
    }

}

class SearchView {

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

    noBookFoundSearch(title, author, isbn, onlyAvailable=false) {
        this.searchResults.hidden = true;
        this.noResults.hidden = false;
        this.searchResults.hidden = true;
        if (!title && !author && !isbn) {
            this.noResults.innerHTML = `Please enter a search term`;
        }
        else if (title === author && author === isbn) {
            this.noResults.innerHTML = `No books found with the search term: ${title}`;
        }
        else {
            let innerHTML = 'No books found with the search terms:<br>';
            if (title) innerHTML += `Title: ${title}<br>`;
            if (author) innerHTML += `Author: ${author}<br>`;
            if (isbn) innerHTML += `ISBN: ${isbn}<br>`;
            if (onlyAvailable) innerHTML += `That are available<br>`;
            this.noResults.innerHTML = innerHTML;
        }
    }

    validSearch(books) {
        this.searchTitle.hidden = false;
        this.searchTitle.innerHTML = `Found ${books.length} books:`;
        this.noResults.hidden = true;
        this.searchResults.hidden = false;
        
        this.bookTableBody.innerHTML = '';
        let count = 1;
        books.forEach(book => {
            const row = document.createElement('tr');
            row.id = `book-${count++}`;
            row.innerHTML = `<td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.availability ? 'Yes' : 'No'}</td>
                <td><button class="update-btn" data-isbn="${book.isbn}" data-row-id="${row.id}" >Update</button></td>`
            this.bookTableBody.appendChild(row);
        });
    }

}

class CatalogueManagementView {

    render(numBooks = 0) {
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

        <h2>Search Books</h2>
        <input type="text" id="search" placeholder="Search by title or author">
        
        <h2>Books in Library</h2>
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
        this.bookCount = document.getElementById('num-books');
    }

    updateBookTable(books) {
        this.bookCount.innerHTML = `There are ${books.length} in the library at the moment`;
        this.bookTableBody.innerHTML = '';
        let count = 1;
        books.forEach(book => {
            const row = document.createElement('tr');
            row.id = `book-${count++}`;

            this.bookTableBody.appendChild(row);
            this.changeToViewMode(row.id, book);
        });
    }

    changeToViewMode(rowId, book) {
        document.getElementById(rowId).innerHTML =
            //  TODO add book id-->
            `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.genre}</td>
                <td>${book.location}</td>
                <td>${book.availability ? 'Yes' : 'No'}</td>
                <td>
                    <button class="update-btn" data-isbn="${book.isbn}" data-row-id="${rowId}">Update</button>
                </td>
            
            
                `
    }

    changeToEditMode(rowId, book) {
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
              
              <button type="submit" class="btn btn-primary update" data-row-id="${rowId}">Update Book</button>
              <button type="submit" class="btn btn-danger remove" data-book-id="${book.bookId}" data-isbn="${book.isbn}">Remove Book</button>
              </div>
            </form>
        </td>`
    }

    clearForm() {
        document.getElementById('book-form').reset();
    }
}
