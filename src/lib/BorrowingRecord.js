class BorrowingRecord {

    // calculation from https://www.epochconverter.com/timestamp-list
    // which are listed in seconds
    static #TWO_WEEKS_EPOCH = 1209600000;

    #recordId
    #borrowedBook
    #borrower
    #borrowDate
    #dueDate
    #returnDate
    #status

    constructor(recordId, borrowedBook, borrower, borrowDate, dueDate, status) {
        this.#recordId = recordId;
        this.#borrowedBook = borrowedBook;
        this.#borrower = borrower;
        this.#borrowDate = borrowDate;
        this.#dueDate = dueDate;
        this.#status = status;
    }

    static createRecord(session, borrowedBookId, borrowerId) {
        const user = session.getMemberByMemberID(borrowerId);
        let book = session.catalogue.books.filter(book => 
            book.viewBookDetails().bookId.toString() === borrowedBookId.toString());
        if (book.length !== 1
            || user === null) {
            return false;
        }
        book = book[0];
        const currentDate = new Date();
        const record = new BorrowingRecord(session.maxBorrowRecordID++, book, user, currentDate, new Date(currentDate.valueOf() + this.#TWO_WEEKS_EPOCH), "On Loan");

        book.toggleAvailability();
        user.borrowBook(book);
        session.borrowingRecords.push(record);
        return true;
    }

    updateRecord() {

    }

    checkOverdue() {

    }

    get recordDetails() {
        console.log(this)
        return {
            recordId: this.#recordId,
            borrowedBook: this.#borrowedBook,
            borrower: this.#borrower,
            borrowDate: this.#borrowDate,
            returnDate: this.#returnDate ? this.#returnDate : "NA",
            dueDate: this.#dueDate,
            status: this.#status
        }
    }
}
