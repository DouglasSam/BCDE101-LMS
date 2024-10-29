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

            <div id="borrow-modal" hidden></div>
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
        this.borrowModalDiv = document.getElementById("borrow-modal");
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

    borrowModal(book, rowId) {
        this.borrowModalDiv.hidden = false;
        this.borrowModalDiv.innerHTML = `
            <dialog id="borrow-dialog">
                <h2>You are loaning out ${book.title}</h2>
                <h3>Enter a membership ID below to load it to that member</h3>
               <form id="borrow-form" data-book-id="${book.bookId}" data-row-id="${rowId}">
                  <div class="row mb-3">
                    <label for="loan-membership-id" class="col-4 col-form-label">Membership ID:</label>
                    <div class="col-8">
                      <input type="number" class="form-control" id="loan-membership-id" placeholder="Membership ID" required>
                    </div>
                  </div>
                  <button id="loan-book" type="submit" class="btn btn-primary">Loan to Member</button>
                </form>
            </dialog>
`
        const borrowModal = document.getElementById("borrow-dialog");
        borrowModal.showModal();

    }

    changeToSuccessModel(book, membershipId) {
        const modal = document.getElementById("borrow-dialog");
        if (modal === null) return;
        modal.innerHTML = `
            <h2>Success</h2>
            <p>"${book.title}" has been loaned to member with membership ID: ${membershipId}</p>
            <button id="close-modal" class="btn btn-primary">Close</button>
        `
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
     * @param books - The list of books that match the search query
     */
    validSearch(books) {
        this.searchTitle.hidden = false;
        this.searchTitle.innerHTML = `Found ${books.length} books:`;
        this.noResults.hidden = true;
        this.searchResults.hidden = false;

        this.bookTableBody.innerHTML = '';
        let count = 1;
        books.forEach(result => {
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
     * @param book
     * @constructor
     */
    SetToDetailsRowMode(rowId, book) {
        const row = document.getElementById(rowId);
        row.innerHTML =
            `<td colspan="5">
                <h3>${book.title}</h3>
                <p><b>Author:</b> ${book.author}</p>
                <p><b>Genre:</b> ${book.genre}</p>
                <p><b>ISBN:</b> ${book.isbn}</p>
                <p><b>Location:</b> ${book.location}</p>
                <p><b>Description:</b> ${book.description}</p>
                <p><b>Availability:</b> ${book.availability ? 'Yes' : 'No'}</p>
                <div class="d-flex align-items-center justify-content-around mb-1">                  
                    <button id="borrow-btn-${rowId}" class="btn btn-primary borrow-btn" data-row-id="${row.id}" data-book-id="${book.bookId}">Borrow</button>        
                    <button class=" btn btn-danger exit-detail-view" data-row-id="${row.id}" data-book-id="${book.bookId}">Exit Detail View</button>                        
                </div>
            </td>`
        if (!book.availability) {
            document.getElementById(`borrow-btn-${rowId}`).disabled = true;
        }
    }

}
