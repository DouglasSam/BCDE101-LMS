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
        const userName = record.recordDetails.borrower.name; // Assuming `name` is a property of the borrower
        const bookTitle = record.recordDetails.borrowedBook.viewBookDetails().title; // Assuming `title` is a property of the borrowed book
        alert(`User ${userName} has returned ${bookTitle}`);
        this.session.saveBorrowingRecordsToStorage();
    }

}
