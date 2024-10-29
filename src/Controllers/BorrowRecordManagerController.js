/**
 * @class BorrowRecordManagerModel
 * @classDesc Class that handles the user returning books
 * @property {BorrowRecordManagerModel} model - The model for the controller
 * @property {BorrowRecordManagerView} view - The view for the controller
 * @constructor - Creates a new ReturnModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class BorrowRecordManagerController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    setCurrentView() {
        this.view.render(this.model.session.borrowingRecords.length ? this.model.session.borrowingRecords.length : 0);
        if (this.model.session.borrowingRecords.length) {
            this.view.updateRecordTable(this.model.session.borrowingRecords);
        }
        
        const borrowForm = document.getElementById('borrow-form');
        borrowForm.addEventListener('submit', this.handleAddRecord.bind(this));
        this.addButtonListeners();
    }
    
    addButtonListeners() {
        const showDetailsActionsButtons = document.querySelectorAll('.view-detail-btn');
        showDetailsActionsButtons.forEach(button => {
            button.addEventListener('click', this.handleShowRecordDetail.bind(this));
        });
        const cancelDetailsButtons = document.querySelectorAll('.cancel-btn');
        cancelDetailsButtons.forEach(button => {
            button.addEventListener('click', this.handleCancelDetails.bind(this));
        });
        const checkOverdueButtons = document.querySelectorAll('.check-overdue-btn');
        checkOverdueButtons.forEach(button => {
            button.addEventListener('click', this.handleCheckOverdue.bind(this));
        });
        const updateReturnDateButtons = document.querySelectorAll('.update-return-date-btn');
        updateReturnDateButtons.forEach(button => {
            button.addEventListener('click', this.handleUpdateReturnDate.bind(this));
        });
        const returnBookButtons = document.querySelectorAll('.return-book-btn');
        returnBookButtons.forEach(button => {
            button.addEventListener('click', this.handleReturnBook.bind(this));
        });
        
    }
    
    handleReturnBook(event) {
        const recordID = event.target.getAttribute('data-record-id');
        const rowID = event.target.getAttribute('data-row-id');
        const record = this.model.findRecordById(recordID);
        if (record) {
            this.model.userReturnsBook(record)
            this.view.setToRowMode(rowID, record);
            this.addButtonListeners();
        }
    }
    
    handleUpdateReturnDate(event) {
        
    }

    handleCheckOverdue(event) {
        const recordID = event.target.getAttribute('data-record-id');
        const rowID = event.target.getAttribute('data-row-id');
        const record = this.model.findRecordById(recordID);
        if (record) {
            this.model.checkOverdue(record);
            this.view.setToDetailsMode(rowID, record);
            this.addButtonListeners();
        }
    }

    handleCancelDetails(event) {
        const rowID = event.target.getAttribute('data-row-id');
        const recordID = event.target.getAttribute('data-record-id');
        const record = this.model.findRecordById(recordID);
        this.view.setToRowMode(rowID, record);
        this.addButtonListeners();
    }
    
    handleShowRecordDetail(event) {
        const rowID = event.target.getAttribute('data-row-id');
        const id = event.target.getAttribute('data-record-id');
        const record = this.model.findRecordById(id);
        if (record) {
            this.view.setToDetailsMode(rowID, record);
            this.addButtonListeners();
        }
        
    }

    handleAddRecord(event) {
        event.preventDefault();
        const bookId = document.getElementById('book-id').value;
        const memberId = document.getElementById('member-id').value;
        const record = this.model.addRecord(bookId, memberId);
        if (record) {
            this.setCurrentView();
        } else {
            document.getElementById('invalid-borrow').hidden = false;
        }
    }
}
