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

}
