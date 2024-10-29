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
        this.view.render();

    }

}
