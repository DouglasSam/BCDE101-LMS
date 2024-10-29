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
        // console.log(borrowedBookId, borrowerId)
        // console.log(session.catalogue.getBooks())
        // console.log(session.users)
        const user = session.getMemberByMemberID(borrowerId);
        let book = session.catalogue.books.filter(book => book.viewBookDetails().bookId === borrowedBookId);
        console.log(user, book)
        if (book.length !== 1
            || user === null) {
            return false;
        }
        book = book[0];
        const currentDate = new Date();
        const record = new BorrowingRecord(session.maxBorrowRecordID++, book, user, currentDate, new Date(currentDate.valueOf() + this.#TWO_WEEKS_EPOCH), "Borrowed");

        book.toggleAvailability();
        user.borrowBook(book);
        session.borrowingRecords.push(record);
        return true;
    }

    updateRecord() {

    }

    checkOverdue() {

    }
}
