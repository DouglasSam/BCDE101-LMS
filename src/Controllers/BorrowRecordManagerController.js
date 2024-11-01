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
        const updateDueDateButtons = document.querySelectorAll('.update-due-date-btn');
        updateDueDateButtons.forEach(button => {
            button.addEventListener('click', this.handleShowDueDateModal.bind(this));
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
    
    handleShowDueDateModal(event) {
        const recordId = event.target.getAttribute('data-record-id');
        const rowId = event.target.getAttribute('data-row-id');
        const record = this.model.findRecordById(recordId);
        if (record) {
            this.view.viewUpdateDueDateModal(rowId, record);
            document.getElementById("new-due-date-form").addEventListener("submit", this.handleUpdateDueDate.bind(this));
        }
    }

    handleUpdateDueDate(event) {
        event.preventDefault();
        const recordId = event.target.getAttribute('data-record-id');
        const rowId = event.target.getAttribute('data-row-id');
        const newDueDateString = document.getElementById('new-due-date').value;
        const record = this.model.findRecordById(recordId);
        if (record) {
            if (this.model.updateDueDate(record, newDueDateString)) {
                const dueDateDialog = document.getElementById('change-due-date-dialog');
                dueDateDialog.close();
                this.view.setToDetailsMode(rowId, record);
                this.addButtonListeners();
            }
        }
    }

    handleCheckOverdue(event) {
        const recordID = event.target.getAttribute('data-record-id');
        const rowID = event.target.getAttribute('data-row-id');
        const record = this.model.findRecordById(recordID);
        if (record) {
            this.model.checkOverdue(record);
            this.view.setToDetailsMode(rowID, record,
                this.model.session.findNotificationsSentToMember(record.recordDetails.borrower));
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
            this.view.setToDetailsMode(rowID, record, 
                this.model.session.findNotificationsSentToMember(record.recordDetails.borrower));
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
