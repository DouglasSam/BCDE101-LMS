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
                    <th>Book ID</th>
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
            `   <td>${book.bookId}</td>
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
        <td colspan="8">
            <form id="book-form-${rowId}">
                <div class="d-flex gap-3 align-items-center mb-3">
                    <div>
                        <label for="book-id-${rowId}" class="form-label">Book ID</label>
                        <input type="text" class="form-control" id="book-id-${rowId}" disabled value="${book.bookId}">
                    </div>
                    <div class="flex-fill">
                        <label for="title-${rowId}" class="form-label">Book Title:</label>
                        <input type="text" class="form-control" id="title-${rowId}" placeholder="Book Title" required value="${book.title}">
                    </div>
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
