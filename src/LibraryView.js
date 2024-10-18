
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
            <p>Use form below to get searching</p>
            <a id="search-toggle" href="#"></a>
            <div id="search-form"></div>
            <h2 id="no-results-found" hidden></h2>
            <div id="search-results" hidden>
                <h2 id="search-title"></h2>
                <table id="book-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Available</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Book rows will be inserted here -->
                    </tbody>
                </table>
            </div>
            `
        searchMode === "simple" ? this.simpleSearch() : this.complexSearch();
        this.noResults = document.getElementById("no-results-found");
        this.searchResults = document.getElementById("search-results");
        this.bookTableBody = document.querySelector('#book-table tbody');
    }
    
    simpleSearch() {
        document.getElementById("search-toggle").innerHTML = "Go to Complex Search Mode"
        document.getElementById("search-form").innerHTML = 
            '<h3>Enter Search Term</h3>' +
            `
            <form id="simple-search-form">
            <input type="text" class="w-100-20px" id="simple-search-input" placeholder="Search by title, author or isbn">
            <button type="submit">Search</button>
            </form>
            `;
        
    }
    
    complexSearch() {
        document.getElementById("search-toggle").innerHTML = "Go to Simple Search Mode"
        document.getElementById("search-form").innerHTML =
            '<h3>Enter Search Fields</h3>' +
            `<form id="complex-search-form">
                <label for="title">Title of Book</label>
                <input id="title" type="text" placeholder="Title">
                <label for="author">Author of Book</label>
                <input id="author" type="text" placeholder="Author"> 
                <label for="isbn">ISBN of Book</label>
                <input id="isbn" type="text" placeholder="ISBN"> 
                <label for="search-available">Only Search Available</label>
                <input id="search-available" type="checkbox"> 
                <button type="submit">Search</button>
            </form>`;
    }
    
    noBookFoundSearch(title, author, isbn, onlyAvailable=false) {
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

    render() {
        document.getElementById("main").innerHTML =
            `
        <h2>Add a Book</h2>
        <ul>
            <li><a id="dataSet" href="#">Reset from DataSet</a></li>
            <li><a id="reset" href="#">Reset</a></li>
        </ul>
        <h2>Enter New Book Details</h2>
        <form id="book-form">
            <input type="text" class="w-100-20px" id="title" placeholder="Book Title" required><br>
            <input type="text" class="w-100-20px" id="author" placeholder="Author" required><br>
            <input type="text" class="w-100-20px" id="isbn" placeholder="ISBN" required><br>
            <button type="submit">Add Book</button>
        </form>

        <h2>Search Books</h2>
        <input type="text" id="search" placeholder="Search by title or author">
        
        <h2>Books in Library</h2>
        <table id="book-table">
            <thead>
                <tr>
<!--                TODO add book id-->
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
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
    }

    updateBookTable(books) {
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
                `<td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.availability ? 'Yes' : 'No'}</td>
                <td><button class="update-btn" data-isbn="${book.isbn}" data-row-id="${rowId}" >Update</button></td>
                `
    }
    
    changeToEditMode(rowId, book) {
        document.getElementById(rowId).innerHTML = `
        <form id="book-form-${rowId}">
            <td><textarea id="title-${rowId}" placeholder="Book Title"  required>${book.title}</textarea></td>
            <td><textarea id="author-${rowId}" placeholder="Author" required>${book.author}</textarea></td>
<!--            TODO update from disabled when using book id to identify books-->
            <td><textarea id="isbn-${rowId}" placeholder="ISBN" required disabled>${book.isbn}</textarea></td> 
            <td><input type="checkbox" id="availability-${rowId}" ${book.availability ? "checked" : ""}></td>
            <td><button class="update" type="submit" data-row-id="${rowId}">Update Book</button>
            <button class="remove" type="submit" data-isbn="${book.isbn}">Remove Book</button></td>
        </form>`
    }
    
    clearForm() {
        document.getElementById('book-form').reset();
    }
}
