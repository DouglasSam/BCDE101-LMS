/**
 * @class BorrowRecordManagerModel
 * @classdesc Handles the user returning books
 *
 * @constructor - Creates a new ReturnModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class BorrowRecordManagerModel {
    
    constructor(session) {
        this.session = session;
        this.loadBorrowingRecordFromStorage();
    }
    
    /**
     * Adds a record to the borrowing records
     * @param {string} bookId - The ID of the book being borrowed
     * @param {string} memberId - The ID of the member borrowing the book
     * @returns {Object} - The record added to the borrowing records
     */
    addRecord(bookId, memberId) {
        return BorrowingRecord.createRecord(this.session, bookId, memberId);
    }
    
    findRecordById(recordId) {
        const filtered = this.session.borrowingRecords.filter(record => record.recordDetails.recordId.toString() === recordId.toString());
        if (filtered.length !== 1) return false;
        return filtered[0];
        
    }
    
    loadBorrowingRecordFromStorage() {
        let recordsJSON = localStorage.getItem('library_borrowing_records');
        let records = recordsJSON ? JSON.parse(recordsJSON) : [];
        records.forEach(record => {
            let book = this.session.catalogue.books.filter(book =>
                book.viewBookDetails().bookId.toString() === record.borrowedBook.toString());
            const member = this.session.getMemberByMemberID(record.borrower);
            if (book.length === 1 && member) {
                const dueDate = new Date(record.dueDate);
                const borrowDate = new Date(record.borrowDate);
                let returnDate = undefined;
                if (record.returnDate) {
                    returnDate = new Date(record.returnDate);
                }
                this.session.maxBorrowRecordID = Math.max(this.session.maxBorrowRecordID, record.recordId+1);
                const borrowingRecord = new BorrowingRecord(record.recordId, book[0], member, borrowDate, dueDate, record.status, returnDate);
                this.session.borrowingRecords.push(borrowingRecord);
            }
        });
    }
    
    userReturnsBook(record) {
        record.updateRecord("Returned");
        const userName = record.recordDetails.borrower.name; 
        const bookTitle = record.recordDetails.borrowedBook.viewBookDetails().title; 
        alert(`User ${userName} has returned ${bookTitle}`);
        this.session.saveBorrowingRecordsToStorage();
    }
    
    checkOverdue(record) {
        const user = record.recordDetails.borrower;
        const userName = user.name;
        const bookTitle = record.recordDetails.borrowedBook.viewBookDetails().title;
        if (record.checkOverdue()) {
            alert(`User ${userName} has an overdue book: ${bookTitle}\nSending Overdue notification to User.`);
            const dateNow = new Date();
            const daysLate = (new Date(dateNow.toDateString()).getTime() - record.recordDetails.dueDateTime)/Session.EPOCH_MILLI_TO_DAYS;
            const notification = new Notification(
                this.session.maxNotificationID++, user, 
                `Hi ${userName}, You have an overdue book: ${bookTitle} that is ${daysLate} days overdue.`, "Created"
            );
            this.session.notifications.push(notification);
            notification.sendOverdueNotification();
            this.session.saveBorrowingRecordsToStorage();
        }
        else {
            alert(`${bookTitle}, on loan to ${userName}, is not overdue`);
        }
    }
    // 1730408363
    // 1730408375358
    
    updateDueDate(record, newDateString) {
        const user = record.recordDetails.borrower;
        const userName = user.name;
        const bookTitle = record.recordDetails.borrowedBook.viewBookDetails().title;
        const newDueDate = new Date(newDateString);
        // New due date should not be before the current, 
        // Allowing for the fact of testing as I have a default length of two weeks for 
        // borrowing a book with a start date of date.now(), and no other way to make a book overdue.
        // wrapping them in new Date to ignore the fact of time. Only want to look at date.
        if (new Date(Date.now()).getTime() >= new Date(newDueDate.toDateString()).getTime()) {
            if (!confirm("The new due date is earlier than the current date, are you sure you want to change the date?")) {
                return false;
            }
        }
        record.updateRecord(newDueDate);
        alert(`${bookTitle} borrowed by ${userName} has a new due date of ${newDueDate.toLocaleDateString()}
        You might need to run "Check Overdue" to check its new status.`)
        this.session.saveBorrowingRecordsToStorage();
        return true;
    }

}
