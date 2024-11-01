class BorrowingRecord {

    static DATE_FROM_DATETIME = (datetime) => {
        return new Date(datetime.toDateString());
    };
    //Change this to change teh default loan time in days
    static #LOAN_TIME_DAYS = 14;
    // DO NOT CHANGE THIS, used for calculating the due date.
    static #LOAN_TIME_MILLI = BorrowingRecord.#LOAN_TIME_DAYS * Session.EPOCH_MILLI_TO_DAYS;

    #recordId
    #borrowedBook
    #borrower
    #borrowDate
    #dueDate
    #returnDate
    #status

    constructor(recordId, borrowedBook, borrower, borrowDate, dueDate, status, returnDate = undefined) {
        this.#recordId = recordId;
        this.#borrowedBook = borrowedBook;
        this.#borrower = borrower;
        this.#borrowDate = borrowDate;
        this.#dueDate = dueDate;
        this.#status = status;
        if (returnDate !== undefined) {
            this.#returnDate = returnDate;
        }
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
        const currentDate = BorrowingRecord.DATE_FROM_DATETIME(new Date());
        const record = new BorrowingRecord(session.maxBorrowRecordID++, book, user, currentDate, new Date(currentDate.valueOf() + this.#LOAN_TIME_MILLI), "On Loan");

        book.toggleAvailability();
        user.borrowBook(book);
        session.borrowingRecords.push(record);
        // Save borrowing record, books and users to storage as they have all been modified
        session.saveBorrowingRecordsToStorage();
        session.saveBooksToStorage();
        session.saveUsersToStorage();
        return true;
    }

    updateRecord(update) {
        if (update instanceof Date) {
            this.#dueDate = update;
        }
        else if (update instanceof String) {
            this.#status = update;
            if (update === "Returned") {
                this.#returnDate = BorrowingRecord.DATE_FROM_DATETIME(new Date());
                this.#borrowedBook.toggleAvailability();
                this.#borrower.returnBook(this.#borrowedBook);
            }
        }
        
        
    }

    checkOverdue() {
        //check to see if book was overdue and due date has been moved.
        if (this.#status === "Overdue") {
            //book is no longer overdue
            if (this.#dueDate > BorrowingRecord.DATE_FROM_DATETIME(new Date())) {
                this.#status = "On Loan";
                return false;
            }
            return true;
        }
        if (this.#status === "On Loan" && this.#dueDate < BorrowingRecord.DATE_FROM_DATETIME(new Date())) {
            this.#status = "Overdue";
            return true;
        }
        return false;
        
    }

    get recordJSON() {
        return {
            recordId: this.#recordId,
            borrowedBook: this.#borrowedBook.viewBookDetails().bookId,
            borrower: this.#borrower.membershipId,
            borrowDate: this.#borrowDate,
            returnDate: this.#returnDate,
            dueDate: this.#dueDate,
            status: this.#status
        }
    }
    
    get recordDetails() {
        return {
            recordId: this.#recordId,
            borrowedBook: this.#borrowedBook,
            borrower: this.#borrower,
            borrowDate: this.#borrowDate.toDateString(),
            returnDate: this.#returnDate ? this.#returnDate.toDateString() : "NA",
            dueDate: this.#dueDate.toDateString(),
            formDueDate: this.#dueDate.toLocaleDateString().replace(/^(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"),
            dueDateObject: this.#dueDate,
            status: this.#status
        }
    }
}
