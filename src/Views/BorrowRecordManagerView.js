/**
 * @class BorrowRecordManagerView
 * @classdesc Handles the view for the return of books by users
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class BorrowRecordManagerView {

    /**
     * Renders the base view
     */
    render(numRecords) {
        document.getElementById("main").innerHTML =
            `<h2>Welcome to the Borrowing Record Manager Page</h2>
        <h3>Loan out a book:</h3>
        <form id="borrow-form">
            <div class="d-flex align-items-center gap-3 mb-3">
                <div class="flex-fill">
                    <label for="book-id" class="form-label">Book ID:</label>
                    <input type="text" class="form-control" id="book-id" placeholder="Book ID" required>
                </div>
                <div class="flex-fill">
                    <label for="member-id" class="form-label">Member ID:</label>
                    <input type="text" class="form-control" id="member-id" placeholder="Member ID" required>
                </div>
            </div>
            <p id="invalid-borrow" class="text-danger" hidden>Invalid Borrowing Request. Make sure the book and member exist and the book is not already borrowed.</p>
            <button type="submit" class="btn btn-primary">Borrow Book</button>
        </form>   
<h2>There are ${numRecords} records in System</h2>
        <h3 id="records-shown"></h3>
        <table id="records-table" class="table table-striped">
            <thead>
                <tr>
                    <th>Record ID</th>
                    <th>Borrowed Book ID</th>
                    <th>Borrowed Book title</th>
                    <th>Borrower Member ID</th>
                    <th>Borrower Email</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>             
                    <th>Action</th>    
                </tr>
            </thead>
            <tbody>
                <!-- User rows will be inserted here -->
            </tbody>
        </table>`;

        this.userTableBody = document.querySelector('#records-table tbody');
        this.tableCount = document.getElementById('records-shown');
        
    }

    /**
     * Updates the table of records with the list of records provided
     * @param records - The list of records to update the table with
     */
    updateRecordTable(records) {
        this.tableCount.innerHTML = `Showing ${records.length} records from the system`;
        this.userTableBody.innerHTML = '';
        let rowNum = 1;
        records.forEach(record => {
            const row = document.createElement('tr');
            row.id = `record-${rowNum++}`;
            this.userTableBody.appendChild(row);
            this.SetToRowMode(row.id, record);
        });
    }

    /**
     * Sets the row to the basic view mode with the smaller details and an edit button
     * @param rowId - The id of the row to update
     * @param record - The user to display the details from
     */
    SetToRowMode(rowId, record) {
        const details = record.recordDetails;
        const book = details.borrowedBook.viewBookDetails();
        document.getElementById(rowId).innerHTML =
            `
                <td>${details.recordId}</td>
                <td>${book.bookId}</td>
                <td>${book.title}</td>
                <td>${details.borrower.membershipId}</td>
                <td>${details.borrower.email}</td>
                <td>${details.dueDate.toDateString()}</td>
                <td>${details.returnDate}</td>
                <td>${details.status}</td>                 
                <td>
                    <button class="update-btn btn btn-primary" data-user-id="${details.recordId}" data-row-id="${rowId}">Edit or Delete Row</button>
                </td>
            `
    }

}