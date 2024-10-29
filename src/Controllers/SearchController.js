/**
 * @class SearchController
 * @classDesc Class that handles searching of the catalogue
 * Gives user the option to use a simple search query or complex
 *      allowing for searching in the different sections of the book or only available books
 * Allows users to view all details about the book handles the borrowing of books
 * @property {SearchModel} model - The model for the controller
 * @property {SearchView} view - The view for the controller
 * @constructor - Creates a new SearchController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class SearchController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Sets the current view for the controller
     */
    setCurrentView() {
        this.view.render(this.model.getBooks().length, this.model.searchMode);
        const searchToggleButton = document.getElementById("search-toggle");

        searchToggleButton.addEventListener('click', this.toggleSearchForm.bind(this));
        this.handleButtonListeners()
    }

    /**
     * Handles all the button listeners for the page that are not initially rendered
     */
    handleButtonListeners() {
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', this.handleViewDetails.bind(this));
        });

        const ExitDetailViewButtons = document.querySelectorAll('.exit-detail-view');
        ExitDetailViewButtons.forEach(button => {
            button.addEventListener('click', this.handleExitDetailView.bind(this));
        });

        const borrowButtons = document.querySelectorAll('.borrow-btn');
        borrowButtons.forEach(button => {
            button.addEventListener('click', this.handleBorrowModal.bind(this));
        });

        if (this.model.searchMode === 'simple') {
            document.getElementById('simple-search-form').addEventListener('submit', this.handleSimpleSearch.bind(this));
        }
        else {
            document.getElementById('complex-search-form').addEventListener('submit', this.handleComplexSearch.bind(this));
        }
    }


    /**
     * EventListener that will return the details view back to the list view
     * @param event - event for the listener
     */
    handleExitDetailView(event) {
        const id = event.target.getAttribute('data-book-id');
        const rowId = event.target.getAttribute('data-row-id');
        const book = this.model.searchBooks({id: id})[0];
        this.view.setToNormalRowMode(rowId, book);
        this.handleButtonListeners()
    }

    /**
     * EventListener that will change the row to the details view
     * @param event - event for the listener
     */
    handleViewDetails(event) {
        const id = event.target.getAttribute('data-book-id');
        const rowId = event.target.getAttribute('data-row-id');
        const book = this.model.searchBooks({id: id})[0];
        this.view.SetToDetailsRowMode(rowId, book);
        this.handleButtonListeners()

    }

    /**
     * EventListener that will handle a user borrowing a book
     * @param event - event for the listener
     */
    handleBorrowModal(event) {
        const id = event.target.getAttribute('data-book-id');
        const rowId = event.target.getAttribute('data-row-id');
        const book = this.model.searchBooks({id: id})[0];
        this.view.borrowModal(book, rowId);
        document.getElementById('borrow-form').addEventListener('submit', this.handleBorrow.bind(this));
    }

    handleBorrow(event) {
        event.preventDefault();
        const memberId = document.getElementById('loan-membership-id').value;
        const bookId = event.target.attributes.getNamedItem('data-book-id').value;
        const rowId = event.target.attributes.getNamedItem('data-row-id').value;
        const book = this.model.searchBooks({id: bookId})[0];
        if (this.model.borrowBook(book, memberId)) {
            this.view.changeToSuccessModel(book, memberId);
            document.getElementById("close-modal").addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById("borrow-dialog").close();
                const newBook = this.model.searchBooks({id: bookId})[0];
                this.view.setToNormalRowMode(rowId, newBook);
                this.handleButtonListeners();
            });
        }

    }

    /**
     * EventListener that will toggle the search form between simple and complex
     * @param event - event for the listener
     */
    toggleSearchForm(event) {
        event.preventDefault();
        this.model.toggleSearchMode();
        if (this.model.searchMode === 'simple') {
            this.view.simpleSearch();
        }
        else {
            this.view.complexSearch();
        }
        this.handleButtonListeners();
    }

    /**
     * EventListener for handling and displaying a simple search
     * @param event - event for the listener
     */
    handleSimpleSearch(event) {
        event.preventDefault();
        const query = document.getElementById('simple-search-input').value;
        const searchResults = this.model.searchBooks({query: query});
        if (searchResults.length === 0) {
            this.view.noBookFoundSearch();
        }
        else {
            this.view.validSearch(searchResults);
            this.handleButtonListeners();
        }

    }

    /**
     * EventListener for handling and displaying a complex search
     * @param event - event for the listener
     */
    handleComplexSearch(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        const genre = document.getElementById('genre').value
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const availableOnly = document.getElementById('search-available').checked;
        const searchResults = this.model.searchBooks({
            title: title ? title : false,
            author: author ? author : false,
            isbn: isbn ? isbn : false,
            genre: genre ? genre : false,
            location: location ? location : false,
            description: description ? description : false,
            availableOnly: availableOnly});
        if (searchResults.length === 0) {
            this.view.noBookFoundSearch();
        }
        else {
            this.view.validSearch(searchResults);
            this.handleButtonListeners();
        }
    }
}
