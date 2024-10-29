/**
 * @class CatalogueManagementController
 * @classDesc Class that handled the management of the catalogue
 * The management of the catalogue includes adding, updating, and removing books
 * It also has a search function to search for books in the catalogue to make updating one book easier
 * It also has a reset function to reset the books in the catalogue to the starting data set
 * It also has a clear function to clear all books from the catalogue
 * @property {CatalogueManagementModel} model - The model for the controller
 * @property {CatalogueManagementView} view - The view for the controller
 * @constructor - Creates a new CatalogueManagementController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class CatalogueManagementController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Sets the current view for the controller
     */
    setCurrentView() {
        this.view.render(this.model.session.catalogue.getBooks().length);
        // DOM Elements
        this.bookForm = document.getElementById('book-form');
        this.searchInput = document.getElementById('search');
        this.dataSet = document.getElementById('dataSet');
        this.reset = document.getElementById('reset');

        // Bind event listeners
        this.bookForm.addEventListener('submit', this.handleAddBook.bind(this));
        this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        this.dataSet.addEventListener('click', this.handleLoadBooksFromDataSet.bind(this));
        this.reset.addEventListener('click', this.handleResetBooks.bind(this));

        // Initial render
        this.view.updateBookTable(this.model.getBooks());
        this.addButtonListeners();
    }

    /**
     * Add all button listeners for the page that are not initially rendered
     */
    addButtonListeners() {
        const updateBookButtons = document.querySelectorAll('.update-book');
        updateBookButtons.forEach(button => {
            button.addEventListener('click', this.handleUpdateBook.bind(this));
        });

        const removeBookButtons = document.querySelectorAll('.remove-book');
        removeBookButtons.forEach(button => {
            button.addEventListener('click', this.handleRemoveBook.bind(this));
        });

        const updateButtons = document.querySelectorAll('.update-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', this.handleEditBook.bind(this));
        });

        const cancelEditButtons = document.querySelectorAll('.cancel-edit');
        cancelEditButtons.forEach(button => {
            button.addEventListener('click', this.handleCancelEdit.bind(this));
        });
    }

    /**
     * EvenListener for canceling the edit form
     * @param event - event for the listener
     */
    handleCancelEdit(event) {
        event.preventDefault();
        const rowID = event.target.attributes.getNamedItem('data-row-id').value;
        const bookId = event.target.attributes.getNamedItem('data-book-id').value;
        const book = this.model.searchBooks({id: bookId})[0];
        this.view.SetToRowMode(rowID, book);
        this.addButtonListeners();
    }

    /**
     * EventListener to clear all books from the storage
     * @param event - event for the listener
     */
    handleResetBooks(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to permanently delete ALL books?`)) {
            this.model.clearAllBooks();
            this.setCurrentView();
        }
    }

    /**
     * EvenListener for resetting the books stored with the starting data set
     * @param event - event for the listener
     */
    handleLoadBooksFromDataSet(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to replace ALL books with those defined in the starting data set?`)) {
            this.model.clearAllBooks();
            this.model.resetBooksFromDataSet().then(() => {
                this.setCurrentView();
            });
        }
    }

    /**
     * EventListener for adding a book to the catalogue
     * @param event - event for the listener
     */
    handleAddBook(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        let genre = document.getElementById('genre').value;
        let location = document.getElementById('location').value;
        const description = document.getElementById('description').value;

        if (genre === '') genre = 'N/A';
        if (location === '') location = 'N/A';
        this.model.addBook(title, author, isbn, genre, location, description);

        this.view.clearForm();
        this.view.updateBookTable(this.model.getBooks());
        this.addButtonListeners();
    }

    /**
     * Handles the search bar on the page
     */
    handleSearch() {
        const query = this.searchInput.value;
        const filteredBooks = this.model.searchBooks({query: query});
        this.view.updateBookTable(filteredBooks);
        this.addButtonListeners();
    }

    /**
     * EventListener for changing the row in the table to the edit view
     * @param event - event for the listener
     */
    handleEditBook(event) {
        const rowID = event.target.getAttribute('data-row-id');
        const id = event.target.getAttribute('data-book-id');
        const book = this.model.searchBooks({id: id})[0];

        this.view.setToEditMode(rowID, book);
        this.addButtonListeners();
    }

    /**
     * EventListener for updating a book in the catalogue
     * @param event - event for the listener
     */
    handleUpdateBook(event) {
        event.preventDefault();
        const rowID = event.target.attributes.getNamedItem('data-row-id').value;
        const bookId = event.target.attributes.getNamedItem('data-book-id').value;
        const newTitle = document.getElementById(`title-${rowID}`).value;
        const newAuthor = document.getElementById(`author-${rowID}`).value;
        const newISBN = document.getElementById(`isbn-${rowID}`).value;
        const newLocation = document.getElementById(`location-${rowID}`).value;
        const newGenre = document.getElementById(`genre-${rowID}`).value;
        const newDescription = document.getElementById(`description-${rowID}`).value;
        const newAvailability = document.getElementById(`availability-${rowID}`).checked;
        this.model.updateBook(bookId, newTitle, newAuthor, newISBN, newGenre, newLocation, newDescription, newAvailability);
        const newBook = this.model.searchBooks({id: bookId})[0];
        this.view.SetToRowMode(rowID, newBook);
        this.addButtonListeners();
    }

    /**
     * EventListener for removing a book from the catalogue
     * @param event - event for the listener
     */
    handleRemoveBook(event) {
        event.preventDefault();
        const id = event.target.attributes.item(2).value;
        const book = this.model.session.catalogue.searchBooks({id: id})[0];

        if (confirm(`Are you sure you want to permanently delete ${book.title} by ${book.author }?`)) {
            this.model.removeBook(id);
            this.view.updateBookTable(this.model.getBooks());
            this.addButtonListeners();
        }
    }

}
