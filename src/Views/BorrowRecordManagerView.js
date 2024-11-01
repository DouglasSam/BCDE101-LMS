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
            <div id="modal" hidden></div>
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
        this.modal = document.getElementById('modal');

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
            this.setToRowMode(row.id, record);
        });
    }

    /**
     * Sets the row to the basic view mode with the smaller details and an edit button
     * @param rowId - The id of the row to update
     * @param record - The user to display the details from
     */
    setToRowMode(rowId, record) {
        const details = record.recordDetails;
        const book = details.borrowedBook.viewBookDetails();
        document.getElementById(rowId).innerHTML =
            `
                <td>${details.recordId}</td>
                <td>${book.bookId}</td>
                <td>${book.title}</td>
                <td>${details.borrower.membershipId}</td>
                <td>${details.borrower.email}</td>
                <td>${details.dueDate}</td>
                <td>${details.returnDate}</td>
                <td>${details.status}</td>                 
                <td>
                    <button class="view-detail-btn btn btn-primary" data-record-id="${details.recordId}" data-row-id="${rowId}">Details and Actions</button>
                </td>
            `
    }

    setToDetailsMode(rowId, record, notifications) {
        const details = record.recordDetails;
        const book = details.borrowedBook.viewBookDetails();
        const member = details.borrower;
        document.getElementById(rowId).innerHTML =
            `
                <td colspan="9">
               
                    <h3 class="text-center">Borrower (Member) details</h3>
                    <div class="member-details d-flex gap-3 justify-content-around">
                        <div>
                            <p><b>User ID: </b>${member.userId}</>
                            <p><b>Full Name: </b>${member.name}</p>
                        </div>
                        <div>
                            <p><b>Email: </b><a href="mailto:${member.email}">${member.email}</a></p>
                            <p><b>Member ID: </b>${member.membershipId}</p>
                        </div>
                    </div>
                    <hr class="w-75 m-auto">
                    <h3 class="text-center">Borrowed Book Details</h3>
                    <div class="member-details d-flex gap-3 justify-content-around">
                        <div>
                            <p><b>Book ID: </b>${book.bookId}</>
                            <p><b>ISBN: </b>${book.isbn}</>
                        </div>
                        <div>
                            <p><b>Title: </b>${book.title}</p>
                            <p><b>Genre: </b>${book.genre}</p>
                        </div>
                        <div>
                            <p><b>Author: </b>${book.author}</p>
                            <p><b>Location: </b>${book.location}</p>
                        </div>
                    </div>
                    <hr class="w-75 m-auto">
                    <h3 class="text-center">Record Details</h3>
                    <div class="member-details d-flex gap-3 justify-content-around">
                        <div>
                            <p><b>Record ID: </b>${details.recordId}</>
                            <p><b>Borrow Date: </b>${details.borrowDate}</>
                        </div>
                        <div>
                            <p><b>Status: </b>${details.status}</p>
                            <p><b>Due Date: </b>${details.dueDate}</p>
                        </div>
                        <div>
                            <p><b>Return Date: </b>${details.returnDate}</p>
                            <a class="link-primary" href="#" id="notification-${rowId}" hidden>User Notification Logs</a>
                        </div>
                    </div>
                    <hr class="w-75 m-auto">
                    <div class="d-flex justify-content-around mt-3">
                        <button class="cancel-btn btn btn-warning" data-row-id="${rowId}" data-record-id="${details.recordId}">Cancel</button>
                        <button id="check-overdue-${rowId}" class="check-overdue-btn btn btn-success" data-row-id="${rowId}" data-record-id="${details.recordId}" hidden>Check Overdue</button>
                        <button id="update-due-date-${rowId}" class="update-due-date-btn btn btn-primary" data-row-id="${rowId}" data-record-id="${details.recordId}" hidden>Update Due Date</button>
                        <button id="return-book-${rowId}" class="return-book-btn btn btn-danger" data-row-id="${rowId}" data-record-id="${details.recordId}" hidden>User Returns Book</button>
                    </div>
                </td>
            `
        if (details.returnDate === "NA") {
            document.getElementById(`return-book-${rowId}`).hidden = false;
            document.getElementById(`check-overdue-${rowId}`).hidden = false;
            document.getElementById(`update-due-date-${rowId}`).hidden = false;
        }
        if (notifications !== null) {
            document.getElementById(`notification-${rowId}`).hidden = false;
            document.getElementById(`notification-${rowId}`).addEventListener('click', (event) => {
                event.preventDefault();
                this.viewNotificationsModal(notifications, member);
            });
        }
    }
    
    viewNotificationsModal(notifications, member) {
        console.log(notifications[0].details);
        this.modal.hidden = false;
        this.modal.innerHTML = `
        <dialog id="notifications-dialog">
                <h3 class="text-center">Notification Logs for ${member.name}</h3>
                <table class="table table-striped">
                    <thead>
                        <th>Notification ID</th>
                        <th>Notification</th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                        ${notifications.map(notification => `
                            <tr>
                                <td>${notification.details.notificationId}</td>
                                <td>${notification.details.message}</td>
                                <td>${notification.details.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button id="close-notifications" class="btn btn-primary">Close</button>
            </dialog>
        `
        const notificationsDialog = document.getElementById('notifications-dialog');
        notificationsDialog.showModal();
        document.getElementById("close-notifications").addEventListener("click", () => notificationsDialog.close());
    }


    viewUpdateDueDateModal(rowId, record) {
        this.modal.hidden = false;
        const book = record.recordDetails.borrowedBook.viewBookDetails();
        const user = record.recordDetails.borrower;
        const date = record.recordDetails.formDueDate;
        this.modal.innerHTML = `
        <dialog id="change-due-date-dialog">
                <h3 class="text-center">You are changing the due date for<br>${book.title}<br>on load to ${user.name}</h3>
                <h4>Enter new due date</h4>
               <form id="new-due-date-form" data-record-id="${record.recordDetails.recordId}" data-row-id="${rowId}">
                  <div class="row mb-3">
                    <label for="new-due-date" class="col-4 col-form-label">New Due Date:</label>
                    <div class="col-8">
                      <input type="date" class="form-control" id="new-due-date" value="${date}" required>
                    </div>
                  </div>
                  <button id="set-new-due-date" type="submit" class="btn btn-primary">Update Due Date</button>
                  <a id="cancel-modal" class="btn btn-danger">Cancel</a>
                </form>
                
            </dialog>
        `
        const dueDateDialog = document.getElementById('change-due-date-dialog');
        dueDateDialog.showModal();
        document.getElementById("cancel-modal").addEventListener("click", () => dueDateDialog.close());
    }

}