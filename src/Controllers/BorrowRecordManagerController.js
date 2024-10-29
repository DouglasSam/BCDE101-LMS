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
